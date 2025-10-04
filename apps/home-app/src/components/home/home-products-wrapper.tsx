'use client'
import { ReactNode, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

interface Product {
  id: string
  name: string
  image: string
  body: ReactNode
}

type Props = {
  title: string
  products: Product[]
}

function HomeProductsWrapper({ title, products }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false, slidesToScroll: 2, loop: true }, [])

  const prev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const next = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className='embla relative group/item border border-black/20 hover:shadow-md hover:bg-slate-100'>
      <p className="text-center font-semibold my-4 text-2xl">{title}</p>
      <div ref={emblaRef} className='embla__viewport overflow-hidden mb-4 px-4'>
        <div className='embla__container flex gap-x-3'>
          {products.map((p, idx) => (
            <div
              key={`${p.id}${idx}`}
              style={{ flex: '0 0 50%' }}
              className='embla__slide flex flex-col'>
              <div className="relative h-40 w-full">
                <Image src={p.image} alt={p.name} fill sizes="100%" className="object-cover" />
              </div>
              <p className="line-clamp-2 text-center mb-4">{p.name}</p>
              {p.body}
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

export default HomeProductsWrapper
