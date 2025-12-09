'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Loader } from '@mantine/core'
import { useInView } from 'react-intersection-observer'

import { IDName, ObjString } from '@megacommerce/shared'
import ProductsCategoryFilters from '@/components/category/products-category-filters'
import { useProductsCategory } from '@/hooks'

type Props = {
  categoryId: string
  categoriesData: { id: string; name: string; image: string; subcategories: IDName[] }[]
  tr: ObjString
}

export default function ProductsCategoryWrapper({ categoryId, categoriesData, tr }: Props) {
  const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  const router = useRouter()
  const { products, loading, error, hasMore, fetchProducts, loadMore, retryFetch, reset } =
    useProductsCategory()
  const { inView, ref } = useInView({ threshold: 0 })
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>()

  const category = categoriesData.find((c) => c.id === categoryId)

  useEffect(() => {
    if (!category) return
    // Fetch with all subcategories by default
    const allSubcategoryIds = category.subcategories.map((s) => s.id)
    setSelectedSubcategories(allSubcategoryIds)
    fetchProducts(categoryId, allSubcategoryIds, sortField, sortDirection)
  }, [categoryId])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore(categoryId, selectedSubcategories, sortField, sortDirection)
    }
  }, [inView, hasMore, loading, categoryId, selectedSubcategories, sortField, sortDirection, loadMore])

  const handleFilterChange = useCallback(
    (subcategoryIds: string[], field?: string, direction?: 'asc' | 'desc') => {
      setSelectedSubcategories(subcategoryIds)
      setSortField(field)
      setSortDirection(direction)
      fetchProducts(categoryId, subcategoryIds, field, direction)
    },
    [categoryId, fetchProducts]
  )

  useEffect(() => {
    if (!category) router.push('/not-found')
  }, [])

  if (!category) return null

  return (
    <div className='flex gap-6 p-6 bg-gray-50 min-h-screen'>
      <div className='w-64 sticky top-6 h-fit'>
        <ProductsCategoryFilters
          tr={tr}
          subcategories={category.subcategories}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>{category.name}</h1>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 mb-8'>
          {products.map((product) => (
            <div
              key={product.id}
              className='flex flex-col border border-orange-100 hover:border-orange-400 hover:shadow-lg transition-all rounded-lg overflow-hidden bg-white'>
              <div className='relative h-48 w-full overflow-hidden bg-gray-100'>
                <Image
                  src={`${mediaHost}/${product.image}`}
                  alt={product.title}
                  fill
                  sizes='100%'
                  className='object-cover hover:scale-105 transition-transform'
                />
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className='absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
                    -{product.discountPercentage}%
                  </div>
                )}
              </div>

              <div className='flex flex-col flex-1 p-3'>
                <h3 className='font-medium text-sm line-clamp-2 text-gray-800 mb-2'>{product.title}</h3>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-lg font-bold text-orange-600'>
                    ${(product.priceCents / 100).toFixed(2)}
                  </span>
                  {product.discountPriceCents && product.discountPriceCents > 0 && (
                    <span className='text-xs text-gray-400 line-through'>
                      ${(product.discountPriceCents / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                {(product.soldCount ?? 0) > 0 && (
                  <p>
                    {product.soldCount} {tr.sold}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className='flex flex-col justify-center items-center border-2 border-dashed border-red-300 rounded-lg p-10 bg-red-50 mb-8'>
            <p className='text-red-600 font-medium mb-4 text-center'>{error}</p>
            <Button onClick={retryFetch} className='bg-orange-600 hover:bg-orange-700'>
              {tr.tryAgain}
            </Button>
          </div>
        )}

        {!error && (
          <div ref={ref} className='flex justify-center items-center py-8'>
            {loading && <Loader color='orange' />}
            {!loading && !hasMore && products.length > 0 && (
              <p className='font-medium text-gray-600'>{tr.noMore}</p>
            )}
          </div>
        )}

        {products.length === 0 && !loading && !error && (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>{tr.noProductsFound}</p>
          </div>
        )}
      </div>
    </div>
  )
}
