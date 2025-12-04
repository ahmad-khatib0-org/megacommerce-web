'use client'
import { Button } from '@mantine/core'
import { ObjString } from '@megacommerce/shared'
import { IconPhoto, IconStarFilled, IconSortAscending } from '@tabler/icons-react'

type FilterItem = {
  label: string
  value: string | number
  count: number
}

type ReviewsFilterProps = {
  filters: FilterItem[]
  currentFilter: string | number
  tr: ObjString
}

function ProductDetailsReviewsFilter({ filters, currentFilter, tr }: ReviewsFilterProps) {
  const defaultFilters: FilterItem[] = [
    { label: tr.withPictures, value: 'with_pics', count: 120 },
    { label: `5 ${tr.rating}`, value: 5, count: 85 },
    { label: `4 ${tr.rating}`, value: 4, count: 20 },
    { label: `3 ${tr.rating}`, value: 4, count: 20 },
    { label: `2 ${tr.rating}`, value: 4, count: 20 },
    { label: `1 ${tr.rating}`, value: 4, count: 20 },
    // ... more rating filters
  ]
  const effectiveFilters = filters.length > 0 ? filters : defaultFilters

  const handleFilterClick = (value: string | number) => {
    // onFilterChange(value === currentFilter ? 'all' : value) // Toggle off
  }

  return (
    <div className='p-4 bg-white border-b border-gray-200 flex'>
      <div className='flex items-center flex-wrap gap-3 overflow-x-auto pb-2'>
        {effectiveFilters.map((filter, idx) => (
          <Button
            key={`${filter.value}-${idx}`}
            variant={currentFilter === filter.value ? 'filled' : 'subtle'}
            color={currentFilter === filter.value ? 'red' : 'gray'}
            size='sm'
            onClick={() => handleFilterClick(filter.value)}
            leftSection={
              filter.value === 'with_pics' ? <IconPhoto size={16} /> : <IconStarFilled size={16} />
            }
            className='whitespace-nowrap rounded-full'>
            {filter.label} ({filter.count.toLocaleString()})
          </Button>
        ))}
      </div>
      <div className='ml-auto flex items-center gap-2 text-sm text-gray-600'>
        <IconSortAscending size={18} />
        <span>{tr.sort}:</span>
        <Button variant='subtle' size='sm' className='text-red-500 font-medium'>
          {tr.latest}
        </Button>
        /
        <Button variant='subtle' size='sm' className='font-medium'>
          {tr.highest}
        </Button>
      </div>
    </div>
  )
}

export default ProductDetailsReviewsFilter
