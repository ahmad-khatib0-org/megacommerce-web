'use client'
import { ObjString } from '@megacommerce/shared'
import HomeProductsWrapper from '@/components/home/home-products-wrapper'

type Props = {
  tr: ObjString
}

function HomeBigDiscount({ tr }: Props) {
  const products = new Array(6).fill(null).map((_, i) => ({
    id: `product-${i}`,
    name: 'the product name and this is ...',
    image: '/images/login.png',
    body: (
      <>
        <div className='flex items-center gap-x-2'>
          <p className='font-bold text-base'>40.44$</p>
          <p className='line-through text-sm'>44.44$</p>
        </div>
        <div className='bg-red-500 px-2 py-1 mt-1 w-max'>
          <p className='text-white text-sm'>-6%</p>
        </div>
      </>
    ),
  }))

  return <HomeProductsWrapper title={tr.bigDisc} products={products} />
}

export default HomeBigDiscount
