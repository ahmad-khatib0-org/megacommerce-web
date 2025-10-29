'use client'
import { IconStarFilled } from '@tabler/icons-react'
import { ObjString } from '@megacommerce/shared'

import HomeProductsWrapper from '@/components/home/home-products-wrapper'

type Props = {
  tr: ObjString
}

function HomeBestSellers({ tr }: Props) {
  const products = new Array(6).fill(null).map((_, i) => ({
    id: `product-${i}`,
    name: 'the product name and this is ...',
    image: '/images/login.png',
    body: (
      <>
        <div className='flex gap-x-2 mb-1'>
          <p className='text-red-700 font-bold'>{40.33}$</p>
          <p className='line-through'>{44.33}$</p>
        </div>
        <div className='flex gap-x-2'>
          <div className='flex justify-center items-center'>
            <p>{4.6}</p>
            <IconStarFilled color='#FEAA00' size={18} />
          </div>
          <p>
            {5000}+ {tr.sold}
          </p>
        </div>
      </>
    ),
  }))

  return <HomeProductsWrapper title={tr.bestSellers} products={products} />
}

export default HomeBestSellers
