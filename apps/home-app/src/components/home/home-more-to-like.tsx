'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Loader, Rating } from '@mantine/core'
import { useInView } from 'react-intersection-observer'

import { ProductToLikeListItem } from '@megacommerce/proto/web/products/v1/products_to_like'
import ProductItemMetadata from '@/components/products/product-item-metadata'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'

import { useAppStore } from '@/store'
import { productsClient } from '@/helpers/client'

type Props = {
  tr: ObjString
}

function HomeMoreToLike({ tr }: Props) {
  const imagesHost = `${process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string}`
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [products, setProducts] = useState<ProductToLikeListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const { inView, ref } = useInView({ threshold: 0 })

  const fetchProducts = async (page: number) => {
    await new Promise((res) => setTimeout(() => res(''), 50))
    let lastId = ''
    if (products.length) lastId = products[products.length - 1].id
    try {
      const res = await (await productsClient()).ProductsToLike({ pagination: { page, lastId } })
      if (res.error) return { error: res.error.message }
      if (res.data) {
        return { products: res.data.products, hasMore: res.data.pagination?.hasNext ?? false }
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
  }, [loading, hasMore, page])

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (inView) loadProducts()
  }, [inView, loadProducts])

  return (
    <div className='flex flex-col mb-10'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(230px,240px))] w-[94%] mx-auto gap-x-3 gap-y-6'>
        {products.map((p, idx) => (
          <Link key={idx} href={`/item/${p.id}?variant_id=${p.variantId}`}>
            <div className='grid grid-rows-[208px,1fr] border border-transparent hover:border hover:border-black/20 hover:shadow-sm pb-2'>
              <div className='relative h-52 w-full'>
                <Image src={`${imagesHost}/${p.image}`} title={p.title} alt={p.title} fill sizes='100%' />
              </div>
              <div className='flex flex-col justify-evenly'>
                <p className='font-light line-clamp-2 px-1'>{p.title}</p>
                <div className='flex items-center gap-x-1 h-7 px-1'>
                  <p className='font-bold'>{p.price?.formatted}</p>
                  {p.price?.discountPrice && (
                    <p className='line-through font-light text-sm'>{p.price.discountPrice}</p>
                  )}
                  {(p.price?.savePercentage || p.price?.saveAmount) && (
                    <p className='font-normal text-red-500 text-sm'>
                      {p.price?.savePercentage ?? p.price?.saveAmount}
                    </p>
                  )}
                </div>
                {(p.rating || p.sold) && (
                  <div className='flex items-center gap-x-1 px-1'>
                    {p.rating && (
                      <div className='flex items-center gap-x-0.5'>
                        <Rating readOnly defaultValue={p.rating} fractions={2} />
                        {p.rating}
                        <p>|</p>
                      </div>
                    )}
                    {p.sold} {tr.sold}
                  </div>
                )}
                {p.meta.map((m, idx) => (
                  <ProductItemMetadata key={idx} meta={m} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {err && (
        <div className='min-w-80 flex flex-col justify-center items-center border border-dashed border-black/30 mx-auto p-10'>
          <p className='text-red-500 font-medium mb-4'>{err}</p>
          <Button onClick={() => loadProducts()} className='bg-red-600 hover:bg-red-500'>
            {tr.tryAgain}
          </Button>
        </div>
      )}
      {!err && (
        <div ref={ref} className='flex justify-center items-center mt-6'>
          {loading && <Loader />}
          {!hasMore && <p className='font-medium'>{tr.noMore}</p>}
        </div>
      )}
    </div>
  )
}

export default HomeMoreToLike
