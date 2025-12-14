'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Title, Text, Badge, Loader, Table } from '@mantine/core'
import { useInView } from 'react-intersection-observer'
import { IconEdit, IconTrash } from '@tabler/icons-react'

import { ProductListItem } from '@megacommerce/proto/web/products/v1/products_list'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { productsClient } from '@/helpers/client'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
}

function ProductsList({ tr }: Props) {
  const imagesHost = `${process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string}`
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { inView, ref } = useInView({ threshold: 0 })

  const fetchProducts = async (pageNum: number) => {
    await new Promise((res) => setTimeout(() => res(''), 50))

    let lastId = ''
    if (products.length) lastId = products[products.length - 1].id

    try {
      const res = await productsClient.ProductsList({ pagination: { page: pageNum, lastId } })
      if (res.error) return { error: res.error.message }
      if (res.data) {
        return {
          products: res.data.products,
          hasMore: res.data.pagination?.hasNext ?? false,
        }
      }
    } catch (err) {
      return { error: handleGrpcWebErr(err, clientInfo.language) }
    }
  }

  const loadProducts = useCallback(async () => {
    if (loading || !hasMore) return

    if (err) setErr('')
    setLoading(true)

    const result = await fetchProducts(page)
    if (result?.error) {
      setErr(result.error)
    } else {
      setHasMore(result?.hasMore ?? false)
      setPage((prevPage) => prevPage + 1)
      setProducts((prevProducts) => [...prevProducts, ...(result?.products ?? [])])
    }

    setLoading(false)
    setInitialLoadAttempted(true)
  }, [loading, hasMore, page, products.length])

  useEffect(() => {
    if (!initialLoadAttempted) loadProducts()
  }, [loadProducts, initialLoadAttempted])

  useEffect(() => {
    if (inView && !err && hasMore) loadProducts()
  }, [inView, loadProducts, err, hasMore])

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'rejected':
        return 'red'
      default:
        return 'gray'
    }
  }

  // Empty state
  if (products.length === 0 && !loading && !err) {
    return (
      <div className='mx-auto px-4 py-8 sm:max-w-[600px] sm:w-full text-center'>
        <div className='mb-8'>
          <Title order={1} className='mb-2'>
            {tr.noProducts}
          </Title>
          <Text c='dimmed'>{tr.noProductsDesc}</Text>
        </div>
        <div className='flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg'>
          <svg className='w-16 h-16 text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8 4M7 7l5 2.5m5-2.5L12 9.5m0 0L7 12m5-2.5l5 2.5'
            />
          </svg>
          <Text size='lg' fw={500} className='mb-4'>
            {tr.noProducts}
          </Text>
          <Button component={Link} href='/products/create' variant='filled' color='blue'>
            {tr.createProduct}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto px-4 py-8 w-full'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <Title order={1} className='mb-2'>
            {tr.title}
          </Title>
          <Text c='dimmed'>{tr.subtitle}</Text>
        </div>
        <Button component={Link} href='/products/create' variant='filled' color='blue'>
          {tr.createProduct}
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '40px' }}>Image</Table.Th>
              <Table.Th>Product</Table.Th>
              <Table.Th style={{ width: '100px' }}>{tr.status}</Table.Th>
              <Table.Th style={{ width: '100px' }} align='right'>
                {tr.price}
              </Table.Th>
              <Table.Th style={{ width: '100px' }} align='right'>
                {tr.quantity}
              </Table.Th>
              <Table.Th style={{ width: '100px' }}>{tr.created}</Table.Th>
              <Table.Th style={{ width: '80px' }} align='right'>
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  {product.image && (
                    <div className='relative w-10 h-10'>
                      <Image
                        src={`${imagesHost}/${product.image}`}
                        alt={product.title}
                        sizes='100%'
                        className='object-cover rounded'
                        fill
                      />
                    </div>
                  )}
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text fw={500} size='sm'>
                      {product.title}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusBadgeColor(product.status)} variant='light'>
                    {product.status}
                  </Badge>
                </Table.Td>
                <Table.Td align='right'>
                  <Text size='sm'>
                    {product.currencyCode} {product.price.toFixed(2)}
                  </Text>
                </Table.Td>
                <Table.Td align='right'>
                  <Text size='sm'>{product.quantity}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size='sm'>{new Date(Number(product.createdAt)).toLocaleDateString()}</Text>
                </Table.Td>
                <Table.Td align='right'>
                  <div className='flex gap-2 justify-end'>
                    <Button
                      component={Link}
                      href={`/products/${product.id}/edit`}
                      variant='subtle'
                      color='blue'
                      size='xs'
                      leftSection={<IconEdit size={14} />}>
                      {tr.edit}
                    </Button>
                    <Button variant='subtle' color='red' size='xs' leftSection={<IconTrash size={14} />}>
                      {tr.delete}
                    </Button>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Error state */}
      {err && (
        <div className='min-w-80 flex flex-col justify-center items-center border border-dashed border-black/30 mx-auto p-10 mt-6'>
          <p className='text-red-500 font-medium mb-4'>{err}</p>
          <Button onClick={() => loadProducts()} className='bg-red-600 hover:bg-red-500'>
            {tr.tryAgain}
          </Button>
        </div>
      )}

      {/* Loading state */}
      {!err && (
        <div ref={ref} className='flex justify-center items-center mt-6'>
          {loading && <Loader />}
          {!hasMore && products.length > 0 && <p className='font-medium'>{tr.noMore}</p>}
        </div>
      )}
    </div>
  )
}

export default ProductsList
