'use client'
import { Badge } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'

type Props = {
  tr: ObjString
}

function Cart({ tr }: Props) {
  const itemsNumber = 0
  return (
    <div className='flex h-full items-center gap-x-2 px-3'>
      <IconShoppingCart size={36} />
      <div className='flex flex-col justify-evenly h-full'>
        <Badge className='bg-black/90 text-white font-bold'>{itemsNumber}</Badge>
        <p>{tr.cart}</p>
      </div>
    </div>
  )
}

export default Cart
