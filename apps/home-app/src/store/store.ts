import 'client-only'
import { useAppStore } from '@/store/app'
import { useProductStore } from '@/store/products'
import { useCartStore } from '@/store/cart'
import { useCategoriesStore } from '@/store/categories'

export const useStore = {
  app: useAppStore,
  products: useProductStore,
  cart: useCartStore,
  categories: useCategoriesStore,
}
