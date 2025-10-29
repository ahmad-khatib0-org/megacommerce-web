'use client'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import autoplay from 'embla-carousel-autoplay'

type Props = {}

autoplay.globalOptions = {
  delay: 5000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
}

function HomeCarousel({ }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [autoplay()])

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

  return (
    <div className='embla flex flex-col h-72 w-screen relative mt-4'>
      <div ref={emblaRef} className='embla__viewport overflow-hidden w-full h-full'>
        <div className='embla__container flex h-full'>
          {carousels.map((c) => (
            <div
              key={c}
              style={{ flex: '0 0 100%' }}
              className='embla__slide relative h-full min-w-0 border bg-red-300'>
              <p>{c}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute w-max left-1/2 -translate-x-1/2 bottom-2'>
        <ul className='flex gap-x-2'>
          {carousels.map((c, idx) => (
            <li
              key={c}
              onClick={() => onClick(idx)}
              className='embla__prev flex items-center cursor-pointer h-4'>
              <span
                className={`block h-1.5 w-10 border border-black/10 ${selectedIndex === idx ? 'bg-white' : 'bg-white/40'
                  }`}></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HomeCarousel
