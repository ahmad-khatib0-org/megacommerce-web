'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductOffer, ProductOfferVariant } from '@megacommerce/proto/products/v1/product'

type PriceBoxProps = {
  currency: string
  offer: ProductOffer
  welcomeDealDiscount?: number
}

export default function ProductDetailsPricing({ currency, offer, welcomeDealDiscount }: PriceBoxProps) {
  const path = useSearchParams()
  const [currentVariant, setCurrentVariant] = useState<ProductOfferVariant | null>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const variantID = path.get('variant_id')
    let variant: ProductOfferVariant | null = null

    if (variantID && offer.offer[variantID]) {
      variant = offer.offer[variantID]
    } else if (Object.keys(offer.offer).length > 0) {
      const firstKey = Object.keys(offer.offer)[0]
      variant = offer.offer[firstKey]
    }

    setCurrentVariant(variant)

    if (variant?.salePriceEnd) {
      const saleEnds = new Date(parseInt(variant.salePriceEnd))
      setSaleEnds(saleEnds)
    } else {
      setSaleEnds(null)
    }
  }, [path, offer])

  const [saleEnds, setSaleEnds] = useState<Date | null>(null)

  useEffect(() => {
    if (!saleEnds) return

    const updateTimer = () => {
      const now = new Date()
      const diff = saleEnds.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [saleEnds])

  if (!currentVariant) return null

  const listPrice = currentVariant.listPrice || currentVariant.price
  const salePrice = currentVariant.salePrice || currentVariant.price
  const currentPrice = currentVariant.hasSalePrice ? salePrice : listPrice

  const discount =
    currentVariant.hasSalePrice && currentVariant.listPrice
      ? Math.round((1 - parseFloat(salePrice) / parseFloat(listPrice)) * 100)
      : undefined

  const discountAmount =
    currentVariant.hasSalePrice && currentVariant.listPrice
      ? (parseFloat(listPrice) - parseFloat(salePrice)).toFixed(2)
      : undefined

  const isWelcomeDeal = welcomeDealDiscount !== undefined
  const isSale = currentVariant.hasSalePrice && timeLeft.hours > 0

  return (
    <div className='border border-[#0044ff] rounded-lg overflow-hidden bg-white'>
      {isWelcomeDeal && (
        <div className='bg-gradient-to-r from-[#0044ff] to-[#0066ff] px-3 py-2 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='relative size-5'>
              <div className='size-5 bg-yellow-400 rounded-full flex items-center justify-center'>
                <span className='text-xs font-bold text-white'>WD</span>
              </div>
            </div>
            <span className='text-white font-medium text-sm'>Welcome Deal</span>
          </div>
          {saleEnds && (
            <div className='flex items-center gap-1 text-white text-sm'>
              <span>Ends:</span>
              <div className='flex items-center gap-1 bg-black/20 px-2 py-1 rounded'>
                <span className='bg-white/20 px-1 rounded min-w-[20px] text-center'>
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span>:</span>
                <span className='bg-white/20 px-1 rounded min-w-[20px] text-center'>
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span>:</span>
                <span className='bg-white/20 px-1 rounded min-w-[20px] text-center'>
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {isWelcomeDeal && welcomeDealDiscount && (
        <div className='flex items-center gap-x-2 p-3 bg-green-50 rounded-lg border border-green-100'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-bold text-green-700'>🎉 Welcome Deal!</span>
          </div>
          <p className='text-sm text-green-600'>
            Save <span className='font-bold'>{welcomeDealDiscount}% extra</span> on your first order!
          </p>
        </div>
      )}
      {isSale && !isWelcomeDeal && (
        <div className='bg-gradient-to-r from-red-500 to-pink-500 px-3 py-2'>
          <div className='flex items-center justify-between text-white'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-bold'>SALE</span>
              {saleEnds && (
                <span className='text-xs'>
                  Ends in: {timeLeft.hours}h {timeLeft.minutes}m
                </span>
              )}
            </div>
            {discount && (
              <span className='text-sm font-bold bg-white/20 px-2 py-0.5 rounded'>{discount}% OFF</span>
            )}
          </div>
        </div>
      )}

      <div className='p-2'>
        <div className='flex items-end gap-2 mb-2'>
          <span className='text-2xl font-bold text-black'>
            {currentPrice}
            {currency}
          </span>

          {discountAmount && (
            <span className='text-sm font-bold bg-red-50 text-red-600 px-2 py-1 rounded'>
              Save {discountAmount}
              {currency}
            </span>
          )}
        </div>

        {currentVariant.listPrice && currentVariant.hasSalePrice && (
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-gray-400 line-through text-lg'>
              {listPrice}
              {currency}
            </span>
            {discount && (
              <span className='text-sm font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded'>
                -{discount}%
              </span>
            )}
          </div>
        )}

        {currentVariant.minimumOrders && currentVariant.minimumOrders.length > 0 && (
          <div className='mb-4'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-medium text-gray-700'>Min. order:</span>
            </div>
            <div className='flex flex-wrap gap-1'>
              {currentVariant.minimumOrders.map((order) => (
                <div
                  key={order.id}
                  className='inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-lg transition-colors border border-gray-200'>
                  <span className='font-bold text-gray-800'>{order.quantity}+</span>
                  <span className='text-gray-500'>units</span>
                  <span className='text-gray-400'>•</span>
                  <span className='font-medium'>
                    {order.price} {currency}
                  </span>
                  <span className='text-base'>/unit</span>
                </div>
              ))}
            </div>
            <p className='text-xs text-gray-500 mt-2'>Lower price for larger quantities</p>
          </div>
        )}

        <div className='flex gap-x-2 items-center space-y-1 text-sm'>
          <div className='flex items-center gap-1 text-green-600'>
            <span>✓</span>
            <span>Free shipping</span>
          </div>
          <div className='flex items-center gap-1 text-blue-600'>
            <span>✓</span>
            <span>30-day returns</span>
          </div>
        </div>

        {/* <div className='mt-3 pt-3 border-t border-gray-100'>
          <div className='inline-flex items-center gap-1 text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded'>
            <span className='font-medium'>Coupon</span>
            <span>Apply for extra discount</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}
