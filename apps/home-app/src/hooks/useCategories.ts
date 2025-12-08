import 'client-only'
import { useCallback, useState } from 'react'
import { useCategoriesStore } from '@/store/categories'
import { productsClient } from '@/helpers/client'
import { CategoryNavbarResponseData } from '@megacommerce/proto/web/products/v1/category_navbar'

interface UseCategories {
  loading: boolean
  error: Error | null
  data: CategoryNavbarResponseData | null
  fetchCategory: (categoryId: string, subcategoryId: string) => Promise<void>
}

/**
 * Hook to fetch and cache category navbar data
 * Uses Zustand store for client-side caching with 10-minute TTL
 */
export function useCategories(): UseCategories {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CategoryNavbarResponseData | null>(null)

  const getCategoryData = useCategoriesStore((s) => s.getCategoryData)
  const setCategoryData = useCategoriesStore((s) => s.setCategoryData)
  const isCacheValid = useCategoriesStore((s) => s.isCacheValid)

  const fetchCategory = useCallback(
    async (categoryId: string, subcategoryId: string) => {
      const cacheKey = `${categoryId}:${subcategoryId}`

      // Check cache first
      if (isCacheValid(cacheKey, 600)) {
        const cachedData = getCategoryData(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setError(null)
          return
        }
      }

      try {
        setLoading(true)
        setError(null)

        const client = await productsClient()
        const response = await client.CategoryNavbar({ categoryId, subcategoryId })

        if (response.error) {
          const err = new Error(response.error.message || 'Failed to fetch category data')
          setError(err)
          setData(null)
          return
        }

        if (response.data) {
          const categoryData = response.data
          setCategoryData(cacheKey, categoryData)
          setData(categoryData)
          setError(null)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        setError(error)
        setData(null)
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    },

    [getCategoryData, setCategoryData, isCacheValid]
  )

  return {
    loading,
    error,
    data,
    fetchCategory,
  }
}
