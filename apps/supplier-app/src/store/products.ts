import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ProductDataResponseData } from '@megacommerce/proto/web/products/v1/product_data'

interface ProductsState {
  product_details_data: ProductDataResponseData | null
  set_product_details_data: (product_details_data: ProductDataResponseData) => void
}

const storeFn: StateCreator<ProductsState> = (set) => ({
  product_details_data: null,
  set_product_details_data: (product_details_data) => set({ product_details_data }),
})

export const useProductsStore =
  process.env.NODE_ENV === 'development'
    ? create<ProductsState>()(devtools(storeFn, { name: 'Products Store' }))
    : create<ProductsState>()(storeFn)

