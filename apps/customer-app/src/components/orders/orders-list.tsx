'use client'
import { useCallback, useEffect, useState } from 'react'
import { Button, Text, Title, Badge, Loader } from '@mantine/core'
import { useInView } from 'react-intersection-observer'
import {
  IconCalendar,
  IconPackage,
  IconTruck,
  IconCheck,
  IconClock,
  IconArrowRight,
  IconX,
} from '@tabler/icons-react'

import { OrderListItem } from '@megacommerce/proto/orders/v1/orders_list'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { ordersClient } from '@/helpers/client'
import { useAppStore } from '@/store'
import OrderListItemComponent from './order-list-item'

type Props = {
  tr: ObjString
}

const statusSteps = [
  { key: 'ORDER_STATUS_CREATED', label: 'orderPlaced', icon: IconCalendar },
  { key: 'ORDER_STATUS_CONFIRMED', label: 'processingStep', icon: IconPackage },
  { key: 'ORDER_STATUS_SHIPPED', label: 'shippedStep', icon: IconTruck },
  { key: 'ORDER_STATUS_DELIVERED', label: 'deliveredStep', icon: IconCheck },
]

const shortStatusToKeyMap: Record<string, string> = {
  UNRECOGNIZED: 'ORDER_STATUS_UNRECOGNIZED',
  CREATED: 'ORDER_STATUS_CREATED',
  CONFIRMED: 'ORDER_STATUS_CONFIRMED',
  SHIPPED: 'ORDER_STATUS_SHIPPED',
  DELIVERED: 'ORDER_STATUS_DELIVERED',
  CANCELLED: 'ORDER_STATUS_CANCELLED',
  REFUNDED: 'ORDER_STATUS_REFUNDED',
  PAYMENT_FAILED: 'ORDER_STATUS_PAYMENT_FAILED',
  PAYMENT_SUCCEEDED: 'ORDER_STATUS_PAYMENT_SUCCEEDED',
  REFUND_REQUESTED: 'ORDER_STATUS_REFUND_REQUESTED',
}

const statusLabelMap: Record<string, keyof ObjString> = {
  ORDER_STATUS_CREATED: 'pending',
  ORDER_STATUS_CONFIRMED: 'processing',
  ORDER_STATUS_SHIPPED: 'shipped',
  ORDER_STATUS_DELIVERED: 'delivered',
  ORDER_STATUS_CANCELLED: 'cancelled',
  ORDER_STATUS_REFUNDED: 'cancelled',
  ORDER_STATUS_PAYMENT_FAILED: 'cancelled',
  ORDER_STATUS_PAYMENT_SUCCEEDED: 'processing',
  ORDER_STATUS_REFUND_REQUESTED: 'pending',
}

const getFullStatusKey = (shortStatus: string) => {
  if (shortStatus.startsWith('ORDER_STATUS_')) return shortStatus
  return shortStatusToKeyMap[shortStatus] || shortStatus
}

function OrdersList({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { inView, ref } = useInView({ threshold: 0 })

  const fetchOrders = async (page: number) => {
    await new Promise((res) => setTimeout(() => res(''), 50))

    let lastId = ''
    if (orders.length) lastId = orders[orders.length - 1].id

    try {
      const res = await (await ordersClient()).OrdersList({ pagination: { page, lastId } })
      if (res.error) return { error: res.error.message }
      if (res.data) {
        return {
          orders: res.data.orders,
          hasMore: res.data.pagination?.hasNext ?? false,
        }
      }
    } catch (err) {
      console.log('err', err)
      return { error: handleGrpcWebErr(err, clientInfo.language) }
    }
  }

  const loadOrders = useCallback(async () => {
    if (loading || !hasMore) return

    if (err) setErr('')
    setLoading(true)

    const result = await fetchOrders(page)
    if (result?.error) {
      setErr(result.error)
    } else {
      setHasMore(result?.hasMore ?? false)
      setPage((prevPage) => prevPage + 1)
      setOrders((prevOrders) => [...prevOrders, ...(result?.orders ?? [])])
    }

    setLoading(false)
    setInitialLoadAttempted(true)
  }, [loading, hasMore, page, orders.length])

  // Helpers rely on the FULL Protobuf key for logic
  const getStatusColor = (fullStatusKey: string) => {
    switch (fullStatusKey) {
      case 'ORDER_STATUS_DELIVERED':
        return 'green'
      case 'ORDER_STATUS_SHIPPED':
        return 'blue'
      case 'ORDER_STATUS_CONFIRMED':
      case 'ORDER_STATUS_PAYMENT_SUCCEEDED':
        return 'orange'
      case 'ORDER_STATUS_CREATED':
      case 'ORDER_STATUS_REFUND_REQUESTED':
        return 'yellow'
      case 'ORDER_STATUS_PAYMENT_FAILED':
      case 'ORDER_STATUS_CANCELLED':
      case 'ORDER_STATUS_REFUNDED':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusLabel = (fullStatusKey: string) => {
    const translationKey = statusLabelMap[fullStatusKey]
    // Returns the human-readable text from the translation object
    return tr[translationKey as keyof typeof tr]
  }

  const getStatusIndex = (fullStatusKey: string) => {
    return statusSteps.findIndex((step) => step.key === fullStatusKey)
  }

  useEffect(() => {
    if (!initialLoadAttempted) loadOrders()
  }, [loadOrders, initialLoadAttempted])

  useEffect(() => {
    if (inView && !err && hasMore) loadOrders()
  }, [inView, loadOrders, err, hasMore])

  const isNonSequentialFinalState = (fullStatusKey: string) =>
    ['ORDER_STATUS_CANCELLED', 'ORDER_STATUS_REFUNDED', 'ORDER_STATUS_PAYMENT_FAILED'].includes(fullStatusKey)

  if (orders.length === 0 && !loading && !err) {
    return (
      <div className='mx-auto px-4 py-8 sm:max-w-[500px] sm:w-[500px] text-center'>
        <div className='mb-8'>
          <Title order={1} className='mb-2'>
            {tr.myOrders}
          </Title>
          <Text c='dimmed'>{tr.trackManage}</Text>
        </div>
        <div className='flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg'>
          <IconPackage size={48} className='text-gray-400 mb-4' />
          <Text size='lg' fw={500} className='mb-2'>
            {tr.noOrders}
          </Text>
          <Button component='a' href='/' variant='light' color='orange' className='mt-4'>
            {tr.trackManage}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto px-4 py-8 w-full'>
      <div className='mb-8'>
        <Title order={1} className='mb-2'>
          {tr.myOrders}
        </Title>
        <Text c='dimmed'>{tr.trackManage}</Text>
      </div>

      <div className='space-y-6'>
        {orders.map((order) => {
          const fullStatusKey = getFullStatusKey(order.status)
          const currentStepIndex = getStatusIndex(fullStatusKey)
          const createdDate = new Date(Number(order.createdAt))
          const isFinalState = isNonSequentialFinalState(fullStatusKey)

          return (
            <div key={order.id} className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
              <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <Title order={3}>Order #{order.id.slice(0, 8).toUpperCase()}</Title>
                    <Badge color={getStatusColor(fullStatusKey)} variant='light' size='lg'>
                      {/* Displays the human-readable label, e.g., 'Processing' */}
                      {getStatusLabel(fullStatusKey)}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <IconCalendar size={16} />
                      <span>
                        {tr.placedOn} {createdDate.toLocaleDateString()}
                      </span>
                    </div>
                    {order.items.length > 0 && order.items[0].estimatedDeliveryDate && (
                      <div className='flex items-center gap-1'>
                        <IconClock size={16} />
                        <span>
                          {tr.estDelivery}{' '}
                          {new Date(Number(order.items[0].estimatedDeliveryDate)).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='text-right'>
                  <Text size='xl' fw={700} className='text-orange-500'>
                    {order.currencyCode} {(Number(order.totalCents) / 100).toFixed(2)}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    {order.items.length} {order.items.length > 1 ? tr.items : tr.item}
                  </Text>
                </div>
              </div>

              <div className='mb-8'>
                <div className='relative'>
                  {/* Only show progress bar for sequential steps */}
                  {!isFinalState && (
                    <>
                      <div className='absolute top-4 left-0 right-0 h-0.5 bg-gray-200'></div>
                      <div
                        className='absolute top-4 left-0 h-0.5 bg-orange-500 transition-all duration-500'
                        style={{
                          width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%`,
                        }}></div>
                    </>
                  )}

                  <div className='relative flex justify-between'>
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = index <= currentStepIndex
                      const isCurrent = fullStatusKey === step.key // Use fullStatusKey

                      // Skip rendering steps if it's a non-sequential state
                      if (isFinalState) return null

                      return (
                        <div key={step.key} className='flex flex-col items-center'>
                          <div
                            className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${isCompleted ? 'bg-orange-500' : 'bg-gray-200'}
                            ${isCurrent ? 'ring-4 ring-orange-200' : ''}
                            transition-all duration-300
                            `}>
                            {isCompleted ? (
                              <Icon size={16} className='text-white' />
                            ) : (
                              <Icon size={16} className='text-gray-400' />
                            )}
                          </div>

                          <Text
                            size='sm'
                            className={`mt-2 ${isCurrent || isCompleted ? 'text-gray-800 font-medium' : 'text-gray-500'
                              }`}>
                            {tr[step.label as keyof typeof tr]}
                          </Text>

                          {isCurrent && (
                            <Text size='xs' c='dimmed' className='mt-1'>
                              {fullStatusKey === 'ORDER_STATUS_DELIVERED' // Use fullStatusKey
                                ? `Delivered on ${createdDate.toLocaleDateString()}`
                                : fullStatusKey === 'ORDER_STATUS_SHIPPED' // Use fullStatusKey
                                  ? `Shipped on ${createdDate.toLocaleDateString()}`
                                  : 'In progress'}
                            </Text>
                          )}
                        </div>
                      )
                    })}

                    {/* Render separate final state if applicable */}
                    {isFinalState && (
                      <div className='w-full text-center'>
                        <IconX size={24} className='text-red-500 mx-auto mb-2' />
                        <Text size='sm' className='text-red-600 font-medium'>
                          {getStatusLabel(fullStatusKey)}
                        </Text>
                        <Text size='xs' c='dimmed' className='mt-1'>
                          {fullStatusKey === 'ORDER_STATUS_CANCELLED'
                            ? `Cancelled on ${createdDate.toLocaleDateString()}`
                            : 'Final State'}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <Title order={4} className='mb-4'>
                  {tr.items}
                </Title>
                <div className='space-y-3'>
                  {order.items.map((item) => (
                    <OrderListItemComponent key={item.id} item={item} tr={tr} />
                  ))}
                </div>
              </div>

              <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200'>
                <div className='space-y-2'>{/* Tracking info would go here */}</div>
                <div className='flex gap-3'>
                  <Button variant='outline' color='gray' size='sm' leftSection={<IconPackage size={16} />}>
                    {tr.viewDetails}
                  </Button>

                  {fullStatusKey === 'ORDER_STATUS_DELIVERED' ? ( // Use fullStatusKey
                    <Button variant='filled' color='orange' size='sm' leftSection={<IconCheck size={16} />}>
                      {tr.leaveReview}
                    </Button>
                  ) : (
                    <Button
                      variant='filled'
                      color='red'
                      size='sm'
                      rightSection={<IconArrowRight size={16} />}>
                      {tr.trackOrder}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {err && (
        <div className='min-w-80 flex flex-col justify-center items-center border border-dashed border-black/30 mx-auto p-10 mt-6'>
          <p className='text-red-500 font-medium mb-4'>{err}</p>
          <Button onClick={() => loadOrders()} className='bg-red-600 hover:bg-red-500'>
            {tr.tryAgain}
          </Button>
        </div>
      )}

      {!err && (
        <div ref={ref} className='flex justify-center items-center mt-6'>
          {loading && <Loader />}
          {!hasMore && orders.length > 0 && <p className='font-medium'>{tr.noMore}</p>}
        </div>
      )}
    </div>
  )
}

export default OrdersList
