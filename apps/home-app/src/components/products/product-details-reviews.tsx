'use client'
import { IconStarFilled } from '@tabler/icons-react'
import { Avatar } from '@mantine/core'

type ReviewItemProps = {
  reviewerName: string
  rating: number
  date: string
  reviewText: string
  images: string[] // URLs for review images
  productSpecs: string // E.g., "Color: Black, Size: L"
}

function ProductDetailsReviewItem({
  reviewerName,
  rating,
  date,
  reviewText,
  images,
  productSpecs,
}: ReviewItemProps) {
  const MAX_RATING = 5
  const stars = Array.from({ length: MAX_RATING }, (_, i) => i < rating)

  return (
    <div className='border-b border-gray-100 p-4 last:border-b-0'>
      <div className='flex items-center gap-3 mb-3'>
        <Avatar src={null} alt={reviewerName} radius='xl' size='md' className='bg-gray-200'>
          {reviewerName.charAt(0)}
        </Avatar>
        <div>
          <p className='font-semibold text-gray-800'>{reviewerName}</p>
          <div className='flex items-center'>
            {stars.map((isFilled, index) => (
              <IconStarFilled
                key={index}
                size={16}
                className={isFilled ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
        <span className='ml-auto text-sm text-gray-500'>{date}</span>
      </div>

      <p className='text-gray-700 mb-3'>{reviewText}</p>

      <p className='text-xs text-gray-500 mb-3'>**Product Specs:** {productSpecs}</p>

      {images.length > 0 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <div
              key={index}
              className='size-20 rounded-lg overflow-hidden relative border border-gray-100 shrink-0'>
              <img src={image} alt={`Review image ${index + 1}`} className='object-cover w-full h-full' />
              {index === 3 && images.length > 4 && (
                <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                  <span className='text-white text-lg font-bold'>+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Wrapper to map over multiple reviews
export default function ProductDetailsReviews() {
  const mockReviews: ReviewItemProps[] = [
    {
      reviewerName: 'Ali K.',
      rating: 5,
      date: '2023-11-01',
      reviewText:
        'Excellent product quality. Exactly as described and fast shipping! Highly recommend the seller.',
      images: ['/images/login.png', '/images/login.png', '/images/login.png'],
      productSpecs: 'Color: Blue, Size: M',
    },
    {
      reviewerName: 'Burak T.',
      rating: 4,
      date: '2023-10-25',
      reviewText: 'Good value for money. The material is a bit thinner than expected, but overall satisfied.',
      images: ['/images/login.png'],
      productSpecs: 'Color: Red, Size: L',
    },
    // ... more reviews
  ]

  return (
    <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
      {mockReviews.map((review, index) => (
        <ProductDetailsReviewItem key={index} {...review} />
      ))}
    </div>
  )
}
