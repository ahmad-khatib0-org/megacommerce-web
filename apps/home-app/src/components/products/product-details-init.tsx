'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductOffer } from '@megacommerce/proto/products/v1/product'

import { useProductStore } from '@/store/products'

type Props = {
  productId: string
  initialOffer: ProductOffer
  initialCurrencyCode: string
  details: Record<
    string,
    {
      variantName: string
      variantData: Record<string, any>
    }
  >
}

function ProductDetailsInit({ details, productId, initialCurrencyCode, initialOffer }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initProductData = useProductStore((state) => state.initProductData)

  const init = () => {
    const variantId = searchParams.get('variant_id')
    if (!variantId || !details[variantId]) {
      let variantId = Object.keys(details)[0]
      router.push(`/item/${productId}?variant_id=${variantId}`)
    }
  }

  useEffect(() => {
    initProductData({ offer: initialOffer, currencyCode: initialCurrencyCode })
  }, [initProductData, initialOffer, initialCurrencyCode])

  useEffect(() => {
    init()
  }, [])

  return null
}

export default ProductDetailsInit
