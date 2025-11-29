'use client'
import { useEffect, useState } from 'react'

import { NewlyAddedProductListItem } from '@megacommerce/proto/web/products/v1/newly_added_products'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { ObjString } from '@megacommerce/shared'

import HomeProductsWrapper from '@/components/home/home-products-wrapper'
import { useAppStore } from '@/store'
import { productsClient } from '@/helpers/client'

type Props = {
  tr: ObjString
}

function HomeNewProducts({ tr }: Props) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [products, setProducts] = useState<NewlyAddedProductListItem[]>([])
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
      const res = await (await productsClient()).NewlyAddedProducts({})
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
        <div className='flex items-center gap-x-2'>
          <p className='font-bold text-base'>
            {pro.salePriceCents ? (pro.salePriceCents / 100).toFixed(2) : (pro.priceCents / 100).toFixed(2)}$
          </p>
          {(pro.salePriceCents ?? 0) > 0 && (
            <p className='line-through text-sm text-gray-500'>{(pro.priceCents / 100).toFixed(2)}$</p>
          )}
        </div>
        {(pro.salePriceCents ?? 0) > 0 && (pro.discountPercentage ?? 0) > 0 && (
          <div className='bg-red-500 px-2 py-1 mt-1 w-max'>
            <p className='text-white text-sm'>-{pro.discountPercentage}%</p>
          </div>
        )}
        <p className='font-light mt-2'>{pro.createdAt}</p>
      </>
    ),
  }))

  return (
    <HomeProductsWrapper
      title={tr.hot}
      products={_products}
      loading={loading}
      error={err}
      tryAgain={tryAgain}
      tryAgainMsg={tr.tryAgain}
    />
  )
}

export default HomeNewProducts
