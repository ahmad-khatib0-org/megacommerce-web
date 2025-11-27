'use client'
import { useEffect, useState } from 'react'
import { IconStarFilled } from '@tabler/icons-react'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { BestSellingProductListItem } from '@megacommerce/proto/web/products/v1/best_selling_products'

import HomeProductsWrapper from '@/components/home/home-products-wrapper'
import { useAppStore } from '@/store'
import { productsClient } from '@/helpers/client'

type Props = {
  tr: ObjString
}

function HomeBestSellers({ tr }: Props) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [products, setProducts] = useState<BestSellingProductListItem[]>([])
  const clientInfo = useAppStore((state) => state.clientInfo)

  const tryAgain = async () => {
    setErr('')
    setProducts([])
    await init()
  }

  const init = async () => {
    if (loading) return
    setLoading(true)
    try {
      console.log('the language is: ', clientInfo.language)
      await new Promise((res) => setTimeout(() => res(''), 2000))
      const res = await productsClient(clientInfo).BestSellingProducts({})
      if (res.error) setErr(res.error.message)
      if (res.data) setProducts(res.data.products)
    } catch (err) {
      setErr(handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const _products = products.map((pro) => ({
    id: pro.id,
    name: pro.title,
    image: `${process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string}/${pro.image}`,
    body: (
      <>
        <div className='flex gap-x-2 mb-1'>
          <p className='text-red-700 font-bold'>
            {pro.salePriceCents
              ? (parseInt(pro.salePriceCents) / 100).toFixed(2)
              : (parseInt(pro.priceCents) / 100).toFixed(2)}
            $
          </p>
          {pro.salePriceCents && (
            <p className='line-through text-gray-500'>{(parseInt(pro.priceCents) / 100).toFixed(2)}$</p>
          )}
        </div>
        <div className='flex gap-x-2'>
          <div className='flex justify-center items-center'>
            <p>{(pro.rating / 10).toFixed(1)}</p>
            <IconStarFilled color='#FEAA00' size={18} />
          </div>
          <p>
            {pro.soldCount}+ {tr.sold}
          </p>
        </div>
      </>
    ),
  }))

  return (
    <HomeProductsWrapper
      title={tr.bestSellers}
      products={_products}
      loading={loading}
      error={err}
      tryAgain={tryAgain}
      tryAgainMsg={tr.tryAgain}
    />
  )
}

export default HomeBestSellers
