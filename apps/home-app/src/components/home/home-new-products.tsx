'use client'
import { useState } from 'react'

import { ObjString } from '@megacommerce/shared'
import HomeProductsWrapper from '@/components/home/home-products-wrapper'

type Props = {
  tr: ObjString
}

function HomeNewProducts({ tr }: Props) {
  const [loading, setLoading] = useState(false)

  const products = new Array(6).fill(null).map((_, i) => ({
    id: `product-${i}`,
    name: 'the product name and this is ...',
    image: '/images/login.png',
    body: (
      <>
        <p className='font-bold text-base'>40.44$</p>
        <p className='font-light mt-2'>Added 1 day ago</p>
      </>
    ),
  }))

  return <HomeProductsWrapper title={tr.hot} products={products} loading={loading} />
}

export default HomeNewProducts
