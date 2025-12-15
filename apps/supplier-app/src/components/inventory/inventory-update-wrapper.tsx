'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, Button, Text, Title } from '@mantine/core'
import { IconPackage, IconChevronLeft } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { InventoryListItem } from '@megacommerce/proto/web/inventory/v1/inventory_list'
import { inventoryClient } from '@/helpers/client'
import { useAppStore } from '@/store'
import InventoryUpdateOperation from './inventory-update-operation'

type Props = {
  tr: ObjString
  itemId: string
}

function InventoryUpdateWrapper({ tr, itemId }: Props) {
  const router = useRouter()
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [item, setItem] = useState<InventoryListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true)
      setErr('')

      const res = await (await inventoryClient()).InventoryGet({ id: itemId })

      if (res.error) {
        setErr(res.error.message || tr.errorLoading)
        return
      }

      if (res.data?.item) setItem(res.data.item)
    } catch (error) {
      setErr(handleGrpcWebErr(error, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }, [itemId, clientInfo.language])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader />
      </div>
    )
  }

  if (err || !item) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
        <p className='text-red-500 font-medium'>{err || tr.itemNotFound}</p>
        <Button
          onClick={() => router.back()}
          leftSection={<IconChevronLeft size={16} />}
          className='bg-red-600 hover:bg-red-500'>
          {tr.back}
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Button
          variant='subtle'
          onClick={() => router.back()}
          leftSection={<IconChevronLeft size={16} />}
          className='mb-4'>
          {tr.back}
        </Button>

        <div className='flex items-center gap-2 mb-4'>
          <IconPackage size={32} className='text-orange-500' />
          <Title order={1}>{tr.title}</Title>
        </div>
        <Text c='dimmed'>{tr.subtitle}</Text>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.product}
            </Text>
            <Title order={4}>{item.productName}</Title>
          </div>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.sku}
            </Text>
            <Title order={4}>{item.sku}</Title>
          </div>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.stock}
            </Text>
            <Title order={4}>{item.quantityTotal}</Title>
          </div>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.available}
            </Text>
            <Title order={4}>{item.quantityAvailable}</Title>
          </div>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.reserved}
            </Text>
            <Title order={4}>{item.quantityReserved}</Title>
          </div>
          <div>
            <Text fw={500} size='sm' c='dimmed'>
              {tr.status}
            </Text>
            <Title order={4}>
              {item.status === 'in_stock'
                ? tr.inStock
                : item.status === 'low_stock'
                  ? tr.lowStockStatus
                  : tr.outOfStockStatus}
            </Title>
          </div>
        </div>
      </div>

      <InventoryUpdateOperation tr={tr} item={item} />
    </div>
  )
}

export default InventoryUpdateWrapper
