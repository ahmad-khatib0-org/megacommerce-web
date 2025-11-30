'use client'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
// import autoplay from 'embla-carousel-autoplay'
import { Loader } from '@mantine/core'

import { HeroProductsResponseData } from '@megacommerce/proto/web/products/v1/hero_products'
import { ObjString } from '@megacommerce/shared'

import HomeSliders from '@/components/home/home-sliders'
import { productsClient } from '@/helpers/client'

type Props = {
  tr: ObjString
}

// autoplay.globalOptions = {
//   delay: 5000,
//   stopOnMouseEnter: true,
//   stopOnInteraction: false,
// }

function HomeCarousel({ tr }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  // const [emblaRef, emblaApi] = useEmblaCarousel({}, [autoplay()])
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [response, setResponse] = useState<HeroProductsResponseData | null>()

  const onClick = useCallback(
    (idx: number) => {
      if (emblaApi) emblaApi.scrollTo(idx)
    },
    [emblaApi]
  )

  const carousels = ['this is the 1', 'this is the 2', 'this is the 3']

  useEffect(() => {
    if (!emblaApi) return
    const update = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    update()
    emblaApi.on('select', update)
    return () => {
      emblaApi.off('select', update)
    }
  }, [emblaApi])

  const init = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(() => res(''), 3000))
    try {
      const res = await (await productsClient()).HeroProducts({})
      if (res.error) setErr(res.error.message)
      else if (res.data) setResponse(res.data)
    } catch (err) {
      console.error('an error fetching hero products', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) {
    return (
      <div className='embla flex justify-center items-center h-72 w-screen relative mt-4 border border-black/10'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='embla flex flex-col h-72 w-screen relative mt-4'>
      <div ref={emblaRef} className='embla__viewport overflow-hidden w-full h-full'>
        <div className='embla__container flex h-full'>{response && <HomeSliders res={response} />}</div>
      </div>
      <div className='absolute w-max left-1/2 -translate-x-1/2 bottom-2'>
        <ul className='flex gap-x-2'>
          {[1, 2].map((c, idx) => (
            <li
              key={c}
              onClick={() => onClick(idx)}
              className='embla__prev flex items-center cursor-pointer h-4'>
              <span
                className={`block h-1.5 w-10 border border-black/10 ${
                  selectedIndex === idx ? 'bg-white' : 'bg-white/40'
                }`}></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HomeCarousel
