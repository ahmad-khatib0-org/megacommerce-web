'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Badge, Text, Title, ActionIcon, Loader, Modal, NumberInput } from '@mantine/core'
import {
  IconPackage,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
} from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { InventoryListItem } from '@megacommerce/proto/web/inventory/v1/inventory_list'
import { inventoryClient } from '@/helpers/client'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
}

function InventoryList({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [items, setItems] = useState<InventoryListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryListItem | null>(null)
  const [editQuantity, setEditQuantity] = useState(0)
  const [editOperation, setEditOperation] = useState<'add' | 'subtract' | 'set'>('set')

  const fetchInventory = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true)
        setErr('')

        const res = await (
          await inventoryClient()
        ).InventoryList({
          pagination: { page: pageNum, pageSize: 20 },
        })

        if (res.error) {
          setErr(res.error.message || tr.errorLoading)
          return
        }

        if (res.data) {
          if (pageNum === 1) {
            setItems(res.data.items || [])
          } else {
            setItems((prev) => [...prev, ...(res.data?.items || [])])
          }
          setHasMore(res.data.pagination?.hasNext || false)
          setPage(pageNum)
        }
      } catch (error) {
        setErr(handleGrpcWebErr(error, clientInfo.language))
      } finally {
        setLoading(false)
      }
    },
    [clientInfo.language, tr.errorLoading]
  )

  useEffect(() => {
    fetchInventory(1)
  }, [fetchInventory])

  const handleEditItem = (item: InventoryListItem) => {
    setSelectedItem(item)
    setEditQuantity(item.quantityTotal)
    setEditOperation('set')
    setEditModalOpen(true)
  }

  const handleUpdateQuantity = async () => {
    if (!selectedItem) return

    // try {
    //   const operationMap = {
    //     set: InventoryUpdateOperation.INVENTORY_UPDATE_OPERATION_SET,
    //     add: InventoryUpdateOperation.INVENTORY_UPDATE_OPERATION_ADD,
    //     subtract: InventoryUpdateOperation.INVENTORY_UPDATE_OPERATION_SUBTRACT,
    //   }
    //
    //   const res = await inventoryClient.InventoryUpdate({
    //     items: [
    //       {
    //         productId: selectedItem.productId,
    //         variantId: selectedItem.variantId,
    //         sku: selectedItem.sku,
    //         operation: operationMap[editOperation],
    //         quantity: editQuantity,
    //       },
    //     ],
    //     reason: `Inventory adjustment via dashboard`,
    //   })
    //
    //   if (res.error) {
    //     setErr(res.error.message || 'Failed to update inventory')
    //     return
    //   }
    //
    //   // Refresh inventory list after update
    //   fetchInventory(1)
    //   setEditModalOpen(false)
    //   setSelectedItem(null)
    // } catch (error) {
    //   setErr(handleGrpcWebErr(error, clientInfo.language))
    // }
  }

  const filteredItems = items.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'green'
      case 'low_stock':
        return 'orange'
      case 'out_of_stock':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (status: string, item: InventoryListItem) => {
    if (item.quantityAvailable === 0) return <IconAlertCircle size={16} className='text-red-500' />
    if (item.quantityAvailable < 10) return <IconTrendingDown size={16} className='text-orange-500' />
    return <IconTrendingUp size={16} className='text-green-500' />
  }

  const lowStockCount = items.filter(
    (item) => item.quantityAvailable < 10 && item.quantityAvailable > 0
  ).length
  const outOfStockCount = items.filter((item) => item.quantityAvailable === 0).length

  if (loading && items.length === 0) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader />
      </div>
    )
  }

  if (err && items.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
        <p className='text-red-500 font-medium'>{err}</p>
        <Button onClick={() => fetchInventory(1)} className='bg-red-600 hover:bg-red-500'>
          {tr.tryAgain}
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <IconPackage size={32} className='text-orange-500' />
          <Title order={1}>{tr.title}</Title>
        </div>
        <Text c='dimmed'>{tr.subtitle}</Text>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-start'>
            <div>
              <Text c='dimmed' size='sm'>
                {tr.totalItems}
              </Text>
              <Title order={3} className='mt-1'>
                {items.length}
              </Title>
            </div>
            <IconPackage size={24} className='text-blue-500' />
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-start'>
            <div>
              <Text c='dimmed' size='sm'>
                {tr.lowStock}
              </Text>
              <Title order={3} className='mt-1 text-orange-500'>
                {lowStockCount}
              </Title>
            </div>
            <IconTrendingDown size={24} className='text-orange-500' />
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-start'>
            <div>
              <Text c='dimmed' size='sm'>
                {tr.outOfStock}
              </Text>
              <Title order={3} className='mt-1 text-red-500'>
                {outOfStockCount}
              </Title>
            </div>
            <IconAlertCircle size={24} className='text-red-500' />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
        <div className='relative'>
          <IconSearch
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            size={20}
          />
          <input
            type='text'
            placeholder={tr.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='py-3 px-6 text-left'>
                  <Text fw={600}>{tr.product}</Text>
                </th>
                <th className='py-3 px-6 text-left'>
                  <Text fw={600}>{tr.sku}</Text>
                </th>
                <th className='py-3 px-6 text-center'>
                  <Text fw={600}>{tr.stock}</Text>
                </th>
                <th className='py-3 px-6 text-center'>
                  <Text fw={600}>{tr.available}</Text>
                </th>
                <th className='py-3 px-6 text-center'>
                  <Text fw={600}>{tr.reserved}</Text>
                </th>
                <th className='py-3 px-6 text-left'>
                  <Text fw={600}>{tr.status}</Text>
                </th>
                <th className='py-3 px-6 text-left'>
                  <Text fw={600}>{tr.actions}</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='py-4 px-6'>
                    <Text fw={500}>{item.productName}</Text>
                  </td>
                  <td className='py-4 px-6'>
                    <Text size='sm' c='dimmed'>
                      {item.sku}
                    </Text>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <Text fw={500}>{item.quantityTotal}</Text>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <Text fw={500}>{item.quantityAvailable}</Text>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <Text fw={500}>{item.quantityReserved}</Text>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(item.status, item)}
                      <Badge color={getStatusColor(item.status)} variant='light'>
                        {item.status === 'in_stock'
                          ? tr.inStock
                          : item.status === 'low_stock'
                            ? tr.lowStockStatus
                            : tr.outOfStockStatus}
                      </Badge>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex gap-2'>
                      <ActionIcon
                        variant='subtle'
                        color='blue'
                        size='sm'
                        onClick={() => handleEditItem(item)}
                        title={tr.edit}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant='subtle' color='gray' size='sm' title={tr.view}>
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant='subtle' color='red' size='sm' title={tr.delete}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className='py-12 text-center'>
            <IconPackage size={48} className='text-gray-300 mx-auto mb-4' />
            <Text c='dimmed'>{tr.noInventory}</Text>
            <Text size='sm' c='dimmed' className='mt-1'>
              {tr.noInventoryDesc}
            </Text>
          </div>
        )}

        {items.length > 0 && (
          <div className='px-6 py-4 border-t border-gray-200 flex justify-between items-center'>
            <Text c='dimmed' size='sm'>
              Showing {filteredItems.length} of {items.length} items
            </Text>
            {hasMore && (
              <Button variant='subtle' size='sm' onClick={() => fetchInventory(page + 1)} loading={loading}>
                Load More
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Quantity Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title='Update Inventory'
        size='md'>
        {selectedItem && (
          <div className='space-y-4'>
            <div>
              <Text fw={500} mb={8}>
                Product: {selectedItem.productName}
              </Text>
              <Text size='sm' c='dimmed' mb={16}>
                SKU: {selectedItem.sku}
              </Text>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Operation</label>
              <select
                value={editOperation}
                onChange={(e) => setEditOperation(e.target.value as 'add' | 'subtract' | 'set')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'>
                <option value='set'>Set to exact quantity</option>
                <option value='add'>Add quantity</option>
                <option value='subtract'>Subtract quantity</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Quantity</label>
              <NumberInput
                value={editQuantity}
                // onChange={(val) => setEditQuantity(val || 0)}
                min={0}
              />
            </div>

            {editOperation === 'set' && (
              <Text size='sm' c='dimmed'>
                Current stock: {selectedItem.quantityTotal}
              </Text>
            )}

            <div className='flex gap-3 mt-6'>
              <Button fullWidth variant='outline' onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              {/* 
<Button fullWidth color='blue' onClick={handleUpdateQuantity}>
                Update
              </Button>
              */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InventoryList
