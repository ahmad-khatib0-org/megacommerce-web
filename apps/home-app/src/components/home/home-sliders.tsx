import Image from 'next/image'
import { Button } from '@mantine/core'

import { HeroProductsResponseData } from '@megacommerce/proto/web/products/v1/hero_products'

type Props = {
  res: HeroProductsResponseData
}

function HomeSliders({ res }: Props) {
  const hostImage = process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string

  const buildPrice = (price: number, salePrice?: number) => {
    return (
      <div className='absolute h-max w-full flex justify-center items-center gap-x-2 bottom-0 backdrop-blur-md bg-white/30 border border-white/20'>
        <p className='font-bold'>
          {(salePrice ?? 0) > 0 ? (salePrice! / 100).toFixed(2) : (price / 100).toFixed(2)}$
        </p>
        {(salePrice ?? 0) > 0 && <p className='line-through'>{(price / 100).toFixed(2)}$</p>}
      </div>
    )
  }

  const buildImage = (image: string, title: string) => {
    return (
      <Image
        src={`${hostImage}/${image}`}
        alt={title}
        title={title}
        sizes='100%'
        fill={true}
        className='object-fill'
      />
    )
  }

  const categorySlider = () => {
    const firstPro = res.categorySlider?.products[0]
    const secondPro = res.categorySlider?.products[1]
    return (
      <div className='flex justify-evenly items-center gap-x-4 bg-[#e1e8ed] h-full'>
        <div className='flex flex-col'>
          <h1 className='text-4xl font-bold text-black mb-2'>{res.categorySlider?.title}</h1>
          <h3 className='text-xl text-black mb-10'>{res.categorySlider?.subtitle}</h3>
          <Button color='black'>{res.categorySlider?.buttonText}</Button>
        </div>
        <div className='h-full flex items-center'>
          <div className='relative h-48 w-[400px]'>
            <div
              className='absolute top-0 left-0 size-48 border-2 border-white shadow-xl'
              style={{
                transform: 'rotate(-5deg)',
                zIndex: 1,
              }}>
              <div className='relative size-full'>
                {buildImage(firstPro!.image, firstPro!.title)}
                {buildPrice(firstPro?.priceCents ?? 0, firstPro?.discountPriceCents)}
              </div>
            </div>
            <div
              className='absolute top-0 right-0 size-48 border-2 border-white shadow-xl'
              style={{
                transform: 'rotate(5deg)',
                transformOrigin: 'bottom right',
                zIndex: 2,
              }}>
              <div className='relative size-full'>
                {buildImage(secondPro!.image, secondPro!.title)}
                {buildPrice(secondPro?.priceCents ?? 0, secondPro?.discountPriceCents)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const welcomeSlider = () => {
    const first = res.welcomeDealsSlider?.products[0]!
    const second = res.welcomeDealsSlider?.products[1]!
    const third = res.welcomeDealsSlider?.products[2]!
    const title = res.welcomeDealsSlider?.title
    const subtitle = res.welcomeDealsSlider?.subtitle
    const button = res.welcomeDealsSlider?.buttonText

    return (
      <div className='flex justify-evenly items-center h-full bg-[#e1e8ed] opacity-95'>
        <div className='relative size-56 border border-black/10'>
          <div className='size-full rounded-md'>{buildImage(first.image, first.title)}</div>
          {first.discountPriceCents && (
            <div className='absolute size-14 flex items-center justify-center -top-6 -right-6 bg-red-700 rounded-full'>
              <p className='text-white'>-{first.discountPercentage}%</p>
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <h1 className='text-3xl text-black font-bold mb-2'>{title}</h1>
          <h3 className='text-xl text-black mb-10'>{subtitle}</h3>
          <Button color='black'>{button}</Button>
        </div>
        <div className='flex gap-x-2'>
          <div className='relative size-40 border-2 border-white shadow-xl'>
            {buildImage(second.image, second.title)}
            {buildPrice(second.priceCents, second.discountPriceCents)}
          </div>
          <div className='relative size-40 border-2 border-white shadow-xl'>
            {buildImage(third.image, third.title)}
            {buildPrice(third.priceCents, third.discountPriceCents)}
          </div>
        </div>
      </div>
    )
  }

  const sliders = [categorySlider(), welcomeSlider()]

  return (
    <>
      {sliders.map((slider, idx) => {
        return (
          <div key={idx} style={{ flex: '0 0 100%' }} className='embla__slide relative h-full min-w-0 border'>
            {slider}
          </div>
        )
      })}
    </>
  )
}

export default HomeSliders
