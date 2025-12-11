'use client'
import Image from 'next/image'
import { Text } from '@mantine/core'

import { OrderLineListItem } from '@megacommerce/proto/orders/v1/orders_list'
import { ObjString } from '@megacommerce/shared'

type Props = {
  item: OrderLineListItem
  tr: ObjString
}

function OrderListItemComponent({ item, tr }: Props) {
  const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  const formatPrice = (cents: number | string | undefined): string => {
    if (!cents) return '$0.00'
    const price = typeof cents === 'string' ? parseFloat(cents) : cents
    return (price / 100).toFixed(2)
  }

  return (
    <div className='flex gap-3 py-3 border-b border-gray-100 last:border-0'>
      <div className='flex-shrink-0'>
        <div className='relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden'>
          {item.productImage ? (
            <Image
              src={`${mediaHost}/${item.productImage}`}
              alt={item.title}
              fill
              sizes='100%'
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
              {tr.items}
            </div>
          )}
        </div>
      </div>

      <div className='flex-1'>
        <Text fw={500} className='mb-1'>
          {item.title}
        </Text>
        <div className='flex justify-between items-end'>
          <div className='text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <span>
                {tr.quantity}: {item.quantity}
              </span>
              <span className='text-gray-400'>•</span>
              <span>
                ${formatPrice(item.unitPriceCents)} {tr.each}
              </span>
            </div>
            {item.salePriceCents && (
              <div className='text-xs text-orange-600 mt-1'>Sale: ${formatPrice(item.salePriceCents)}</div>
            )}
          </div>
          <Text fw={600}>${formatPrice(item.totalCents)}</Text>
        </div>
      </div>
    </div>
  )
}

export default OrderListItemComponent
