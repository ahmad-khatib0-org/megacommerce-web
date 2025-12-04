'use client'
import { useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ProductMedia } from '@megacommerce/proto/products/v1/product'

type VariantDisplayData = {
  variantId: string
  img: string
  name: string
}

type Props = {
  productId: string
  details: {
    shared: Record<string, any>
    details: Record<string, { variantName: string; variantData: Record<string, any> }>
  }
  media: ProductMedia
}

function ProductDetailsCategoryFashion({ details, media, productId }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const colors: VariantDisplayData[] = useMemo(() => {
    const variants: VariantDisplayData[] = []

    if (details?.details && typeof details.details === 'object') {
      for (const [variantId, variantData] of Object.entries(details.details)) {
        const variantMedia = media.media[variantId]?.images
        const firstImageId = variantMedia ? Object.keys(variantMedia)[0] : undefined
        const imgUrl = firstImageId ? variantMedia[firstImageId].url : ''
        variants.push({ variantId, name: variantData.variantName, img: imgUrl })
      }
    }
    return variants
  }, [details.details, media.media])

  const currentVariantId = searchParams.get('variant_id') ?? ''

  const onClick = useCallback(
    (variantId: string) => {
      if (variantId !== currentVariantId) {
        router.push(`/item/${productId}?variant_id=${variantId}`)
      }
    },
    [router, productId, currentVariantId]
  )

  if (colors.length <= 1) return null

  return (
    <ul className='flex flex-wrap items-center gap-x-2 gap-y-1 mt-2'>
      {colors.map((color) => {
        const isSelected = color.variantId === currentVariantId
        return (
          <li
            key={color.variantId}
            onClick={() => onClick(color.variantId)}
            className={`py-1 px-2 rounded-md border transition-all duration-150 ease-in-out cursor-pointer select-none ${isSelected
                ? 'border-red-700 font-medium bg-red-50 text-red-800 shadow-sm'
                : 'border-black/20 text-gray-700 hover:border-gray-500'
              }`}>
            <p>{color.name}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default ProductDetailsCategoryFashion
