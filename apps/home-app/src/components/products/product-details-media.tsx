'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { ProductMedia, ProductMediaImage } from '@megacommerce/proto/products/v1/product'

type Props = {
  media: ProductMedia
}

function ProductDetailsMedia({ media }: Props) {
  const mediaBaseURL = process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string
  const [current, setCurrent] = useState<ProductMediaImage | null>(null)
  const [thumbnails, setThumbnails] = useState<{ [key: string]: ProductMediaImage }>({})
  const search = useSearchParams()

  const getFirstImage = () => {
    const firstVariantKey = Object.keys(media.media)[0]
    const firstVariant = media.media[firstVariantKey]
    const firstImageKey = Object.keys(firstVariant?.images ?? {})[0]
    return firstVariant?.images?.[firstImageKey] ?? null
  }

  const getFirstVariantImages = () => {
    const firstVariantKey = Object.keys(media.media)[0]
    const firstVariant = media.media[firstVariantKey]
    return firstVariant?.images ?? {}
  }

  const init = () => {
    const variantId = search.get('variant_id')

    if (!variantId || !media.media[variantId]) {
      const firstImage = getFirstImage()
      const firstImages = getFirstVariantImages()
      setCurrent(firstImage)
      setThumbnails(firstImages)
      return
    }

    const variant = media.media[variantId]
    if (variant?.images) {
      const firstImageKey = Object.keys(variant.images)[0]
      setCurrent(variant.images[firstImageKey])
      setThumbnails(variant.images)
    }
  }

  useEffect(() => {
    init()
  }, [search])

  const handleThumbnailClick = (thumbnail: ProductMediaImage) => {
    setCurrent(thumbnail)
  }

  if (!current) return null

  return (
    <div className='flex gap-4'>
      <div className='h-96 flex-shrink-0'>
        <div className='h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          <ul className='flex flex-col gap-2'>
            {Object.keys(thumbnails).map((key) => {
              const thumb = thumbnails[key]
              return (
                <li
                  key={key}
                  className={`
                    relative size-16 md:size-20 cursor-pointer rounded-md overflow-hidden border-2
                    ${current.url === thumb.url ? 'border-blue-500' : 'border-transparent'}
                    hover:border-gray-300 transition-colors
                  `}
                  onClick={() => handleThumbnailClick(thumb)}>
                  <Image
                    src={`${mediaBaseURL}/${thumb.url}`}
                    alt='product thumbnail'
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className='relative flex-1'>
        <div className='relative aspect-square size-96 overflow-hidden rounded-lg bg-gray-100 border border-gray-200'>
          <Image
            src={`${mediaBaseURL}/${current.url}`}
            alt='product image'
            fill
            sizes='100%'
            className='object-cover'
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsMedia
