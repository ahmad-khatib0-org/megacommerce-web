'use client'
import { IconStarFilled } from '@tabler/icons-react'
import { Tooltip, Progress } from '@mantine/core'

import { ObjString } from '@megacommerce/shared'

type ReviewStatsProps = {
  tr: ObjString
  averageRating: number
  totalReviews: number
  ratingCounts: { star: number; count: number }[]
}

function ProductDetailsReviewStats({ averageRating, totalReviews, ratingCounts, tr }: ReviewStatsProps) {
  const maxReviews = Math.max(...ratingCounts.map((rc) => rc.count), 1)

  return (
    <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm mt-10'>
      <h2 className='text-xl font-bold mb-4'>{tr.ratingAndReviews}</h2>

      <div className='flex gap-8'>
        <div className='flex flex-col items-center justify-center shrink-0'>
          <div className='flex items-center text-4xl font-extrabold text-red-600 mb-1'>
            {averageRating.toFixed(1)}
            <IconStarFilled size={24} className='text-red-600 ml-1' />
          </div>
          <p className='text-sm text-gray-500'>
            {totalReviews.toLocaleString()} {tr.reviews}
          </p>
        </div>

        <div className='flex-1 space-y-1'>
          {ratingCounts
            .sort((a, b) => b.star - a.star)
            .map(({ star, count }) => (
              <div key={star} className='flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-600'>
                  {star} {tr.stars}
                </span>
                <Tooltip label={`${count.toLocaleString()} ${tr.ratings}`} position='top' withArrow>
                  <div className='flex-1'>
                    <Progress value={(count / maxReviews) * 100} color='red' size='sm' radius='xl' />
                  </div>
                </Tooltip>
                <span className='w-10 text-right text-sm text-gray-500'>{count.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsReviewStats
