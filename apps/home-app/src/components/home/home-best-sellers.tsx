'use client'
import { useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { IconArrowLeft, IconArrowRight, IconStarFilled } from "@tabler/icons-react"

import { ObjString } from "@megacommerce/shared"

type Props = {
  tr: ObjString
}

function HomeBestSellers({ tr }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false, slidesToScroll: 2, loop: true }, [])
  const products = new Array(6).fill(null).map((_, i) => ({
    id: `product-${i}`,
    name: 'the product name and this is ...',
    image: '/images/login.png',
    discount_price: 34.55,
    original_price: 40.33,
    rating: 4.6,
    sold_count: 5000,
  }))

  const prev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const next = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className='embla relative group/item border border-black/20 hover:shadow-md hover:bg-slate-100'>
      <p className="text-center font-semibold my-4 text-2xl">{tr.bestSellers}</p>
      <div ref={emblaRef} className='embla__viewport overflow-hidden mb-4 px-4'>
        <div className='embla__container flex gap-x-3'>
          {products.map((c, idx) => (
            <div
              key={`${c.id}${idx}`}
              style={{ flex: '0 0 50%' }}
              className='embla__slide flex flex-col'>
              <div className="relative h-40 w-full">
                <Image src={c.image} alt={c.name} fill className="object-cover" />
              </div>
              <p className="line-clamp-2 text-center mb-4">{c.name}</p>
              <div className="flex gap-x-2 mb-1">
                <p className="text-red-700 font-bold">{c.discount_price}$</p>
                <p className="line-through">{c.original_price}</p>
              </div>
              <div className="flex gap-x-2">
                <div className="flex justify-center items-center">
                  <p>{c.rating}</p>
                  <IconStarFilled color="#FEAA00" size={18} />
                </div>
                <p>{c.sold_count} {tr.sold}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => prev()} className="absolute top-1/2 -translate-y-1/2 invisible group-hover/item:visible bg-slate-500 p-2">
        <IconArrowLeft color="#fbfbfb" />
      </button>
      <button onClick={() => next()} className="absolute top-1/2 -translate-y-1/2 right-0 invisible group-hover/item:visible bg-slate-500 p-2">
        <IconArrowRight color="#fbfbfb" />
      </button>
    </div>
  )
}

export default HomeBestSellers
