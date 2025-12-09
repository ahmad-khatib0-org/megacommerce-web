import 'client-only'
import { useCallback, useState } from 'react'
import { productsClient } from '@/helpers/client'
import { ProductsCategoryItem } from '@megacommerce/proto/web/products/v1/products_category'
import {
  PaginationRequest,
  PaginationSort,
  SortDirection,
} from '@megacommerce/proto/web/shared/v1/pagination'
import { useAppStore } from '@/store'

interface UseProductsCategoryState {
  products: ProductsCategoryItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
}

interface UseProductsCategoryActions {
  fetchProducts: (
    categoryId: string,
    subcategoryIds: string[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ) => Promise<void>
  loadMore: (
    categoryId: string,
    subcategoryIds: string[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ) => Promise<void>
  retryFetch: () => Promise<void>
  reset: () => void
}

/**
 * Hook to manage products category pagination with sorting
 * Handles cursor-based pagination using ULID
 * Supports filtering by subcategories and sorting by price or date
 */
export function useProductsCategory(): UseProductsCategoryState & UseProductsCategoryActions {
  const [products, setProducts] = useState<ProductsCategoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [lastFetchParams, setLastFetchParams] = useState<{
    categoryId: string
    subcategoryIds: string[]
    sortField?: string
    sortDirection?: 'asc' | 'desc'
  } | null>(null)

  const clientInfo = useAppStore((s) => s.clientInfo)

  const buildPaginationRequest = (
    pageNum: number,
    lastId: string,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): PaginationRequest => {
    const sortBy: PaginationSort[] = []
    if (sortField) {
      sortBy.push({
        name: sortField,
        direction:
          sortDirection === 'asc' ? SortDirection.SORT_DIRECTION_ASC : SortDirection.SORT_DIRECTION_DESC,
      })
    }

    return { page: pageNum, lastId: lastId, pageSize: 20, sortBy }
  }

  const fetchProducts = useCallback(
    async (
      categoryId: string,
      subcategoryIds: string[],
      sortField?: string,
      sortDirection?: 'asc' | 'desc'
    ) => {
      try {
        setLoading(true)
        setError(null)
        setProducts([])
        setPage(1)
        setLastFetchParams({ categoryId, subcategoryIds, sortField, sortDirection })

        const client = await productsClient()
        const pagination = buildPaginationRequest(1, '', sortField, sortDirection)

        const response = await client.ProductsCategory({
          categoryId,
          subcategoryIds,
          pagination,
        })

        if (response.error) {
          setError(response.error.message || 'Failed to fetch products')
          setProducts([])
          setHasMore(false)
          return
        }

        if (response.data) {
          setProducts(response.data.products)
          setHasMore(response.data.pagination?.hasNext ?? false)
          setPage(2)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(message)
        setProducts([])
        setHasMore(false)
        console.error('Error fetching category products:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const loadMore = useCallback(
    async (
      categoryId: string,
      subcategoryIds: string[],
      sortField?: string,
      sortDirection?: 'asc' | 'desc'
    ) => {
      if (loading || !hasMore) return

      try {
        setError(null)
        setLoading(true)

        const lastId = products.length > 0 ? products[products.length - 1].id : ''
        const client = await productsClient()
        const pagination = buildPaginationRequest(page, lastId, sortField, sortDirection)

        const response = await client.ProductsCategory({
          categoryId,
          subcategoryIds,
          pagination,
        })

        if (response.error) {
          setError(response.error.message || 'Failed to load more products')
          return
        }

        if (response.data) {
          setProducts((prev) => [...prev, ...(response.data?.products ?? [])])
          setHasMore(response.data.pagination?.hasNext ?? false)
          setPage((prev) => prev + 1)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(message)
        console.error('Error loading more products:', err)
      } finally {
        setLoading(false)
      }
    },
    [loading, hasMore, page, products]
  )

  const retryFetch = useCallback(async () => {
    if (lastFetchParams) {
      await fetchProducts(
        lastFetchParams.categoryId,
        lastFetchParams.subcategoryIds,
        lastFetchParams.sortField,
        lastFetchParams.sortDirection
      )
    }
  }, [lastFetchParams, fetchProducts])

  const reset = useCallback(() => {
    setProducts([])
    setLoading(false)
    setError(null)
    setHasMore(true)
    setPage(1)
    setLastFetchParams(null)
  }, [])

  return {
    products,
    loading,
    error,
    hasMore,
    page,
    fetchProducts,
    loadMore,
    retryFetch,
    reset,
  }
}
