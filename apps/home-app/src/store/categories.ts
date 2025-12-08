import 'client-only'
import { create } from 'zustand'
import { CategoryNavbarResponseData } from '@megacommerce/proto/web/products/v1/category_navbar'

interface CategoryCache {
  data: CategoryNavbarResponseData
  timestamp: number
}

interface CategoryState {
  cache: Map<string, CategoryCache>
  getCategoryData: (key: string) => CategoryNavbarResponseData | null
  setCategoryData: (key: string, data: CategoryNavbarResponseData) => void
  isCacheValid: (key: string, ttlSeconds: number) => boolean
  clearCache: () => void
}

const CACHE_TTL_SECONDS = 600 // 10 minutes

export const useCategoriesStore = create<CategoryState>((set, get) => ({
  cache: new Map(),

  getCategoryData: (key: string) => {
    const state = get()
    const cached = state.cache.get(key)
    if (!cached) return null

    // Check if cache is still valid (10 minute TTL)
    const now = Date.now()
    if (now - cached.timestamp > CACHE_TTL_SECONDS * 1000) {
      state.cache.delete(key)
      return null
    }

    return cached.data
  },

  setCategoryData: (key: string, data: CategoryNavbarResponseData) => {
    set((state) => {
      const newCache = new Map(state.cache)
      newCache.set(key, {
        data,
        timestamp: Date.now(),
      })
      return { cache: newCache }
    })
  },

  isCacheValid: (key: string, ttlSeconds: number = CACHE_TTL_SECONDS) => {
    const state = get()
    const cached = state.cache.get(key)
    if (!cached) return false

    const now = Date.now()
    return now - cached.timestamp <= ttlSeconds * 1000
  },

  clearCache: () => {
    set({ cache: new Map() })
  },
}))
