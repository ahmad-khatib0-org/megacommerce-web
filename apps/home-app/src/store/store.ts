import 'client-only'
import { useAppStore } from '@/store/app'
import { useProductStore } from '@/store/products'

export const useStore = {
  app: useAppStore,
  products: useProductStore,
}
