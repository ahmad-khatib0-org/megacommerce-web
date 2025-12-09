'use client'
import { useState } from 'react'
import { Button, Checkbox, Group, Stack } from '@mantine/core'

import { IDName, ObjString } from '@megacommerce/shared'

type Props = {
  tr: ObjString
  subcategories: IDName[]
  onFilterChange: (subcategoryIds: string[], sortField?: string, sortDirection?: 'asc' | 'desc') => void
  loading?: boolean
}

type SortOption = {
  field: string
  direction: 'asc' | 'desc'
  label: string
}

function ProductsCategoryFilters({ tr, subcategories, onFilterChange, loading = false }: Props) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null)

  const sortOptions: SortOption[] = [
    { field: 'created_at', direction: 'desc', label: tr.newest },
    { field: 'created_at', direction: 'asc', label: tr.oldest },
    { field: 'price', direction: 'asc', label: tr.lowToHigh },
    { field: 'price', direction: 'desc', label: tr.highToLow },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = subcategories.map((s) => s.id)
      setSelectedSubcategories(allIds)
      onFilterChange(allIds, selectedSort?.field, selectedSort?.direction)
    } else {
      setSelectedSubcategories([])
      onFilterChange([], selectedSort?.field, selectedSort?.direction)
    }
  }

  const handleSubcategoryChange = (id: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedSubcategories, id]
    } else {
      updated = selectedSubcategories.filter((s) => s !== id)
    }
    setSelectedSubcategories(updated)
    onFilterChange(updated, selectedSort?.field, selectedSort?.direction)
  }

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort)
    onFilterChange(selectedSubcategories, sort.field, sort.direction)
  }

  return (
    <div className='flex flex-col gap-6 p-4 bg-white border border-orange-100 rounded-lg'>
      <div>
        <h3 className='font-semibold text-lg mb-4 text-gray-800'>{tr.subcategories}</h3>
        <Stack gap='sm'>
          <Checkbox
            label={tr.selectAll}
            checked={selectedSubcategories.length === subcategories.length && subcategories.length > 0}
            indeterminate={
              selectedSubcategories.length > 0 && selectedSubcategories.length < subcategories.length
            }
            onChange={(e) => handleSelectAll(e.currentTarget.checked)}
            classNames={{
              input: 'border-orange-300 checked:bg-orange-600 checked:border-orange-600',
            }}
          />

          <div className='ml-4 flex flex-col gap-2 border-l-2 border-orange-200 pl-4'>
            {subcategories.map((sub) => (
              <Checkbox
                key={sub.id}
                label={sub.name}
                checked={selectedSubcategories.includes(sub.id)}
                onChange={(e) => handleSubcategoryChange(sub.id, e.currentTarget.checked)}
                classNames={{
                  input: 'border-orange-300 checked:bg-orange-600 checked:border-orange-600',
                }}
              />
            ))}
          </div>
        </Stack>
      </div>

      <div>
        <h3 className='font-semibold text-lg mb-4 text-gray-800'>{tr.sortBy}</h3>
        <div className='flex flex-col gap-2 border-l-2 border-orange-200 pl-4'>
          {sortOptions.map((sort) => (
            <Button
              key={`${sort.field}-${sort.direction}`}
              onClick={() => handleSortChange(sort)}
              disabled={loading}
              variant={
                selectedSort?.field === sort.field && selectedSort?.direction === sort.direction
                  ? 'filled'
                  : 'outline'
              }
              className={`${selectedSort?.field === sort.field && selectedSort?.direction === sort.direction
                  ? 'bg-orange-600 hover:bg-orange-700 border-orange-600'
                  : 'border-orange-200 text-orange-600 hover:border-orange-400'
                }`}>
              {sort.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsCategoryFilters
