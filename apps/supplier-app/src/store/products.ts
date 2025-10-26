import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ProductDataResponseData } from '@megacommerce/proto/web/products/v1/product_data'

import { ProductVariationsFormValues } from '@/components/products/create/product-create-details-with-variations'

interface ProductCategoryInfo {
  category: string
  subcategory: string
}

interface ProductsState {
  product_details_data: ProductDataResponseData | null
  product_details_form_values: Record<string, any>
  set_product_details_form_values: (product_details_form_values: Record<string, any>) => void,
  product_details_variations_form_values: ProductVariationsFormValues
  set_product_details_variations_form_values: (v: ProductVariationsFormValues) => void
  product_category_info: ProductCategoryInfo
  set_product_details_data: (product_details_data: ProductDataResponseData) => void
}

const storeFn: StateCreator<ProductsState> = (set) => ({
  product_details_data: null,
  product_details_form_values: {},
  set_product_details_form_values: (product_details_form_values) => set({ product_details_form_values }),
  product_details_variations_form_values: { variations: [] },
  set_product_details_variations_form_values: (product_details_variations_form_values) => set({ product_details_variations_form_values }),
  product_category_info: { category: "", subcategory: "" },
  set_product_details_data: (product_details_data) => set({ product_details_data }),
})

export const useProductsStore =
  process.env.NODE_ENV === 'development'
    ? create<ProductsState>()(devtools(storeFn, { name: 'Products Store' }))
    : create<ProductsState>()(storeFn)

