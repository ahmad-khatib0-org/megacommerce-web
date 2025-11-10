import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ValueLabel } from '@megacommerce/shared'
import { ProductDataResponseData } from '@megacommerce/proto/web/products/v1/product_data'

import { ProductCreateDetailsVariationsFormValues } from '@/components/products/create/product-create-details-with-variations'
import { ProductCreateOfferFormValuesPayload } from '@/components/products/create/product-create-offer'
import { deepMerge } from '@megacommerce/shared/client'

interface ProductCategoryInfo {
  category: string
  category_name: string
  subcategory: string
  subcategory_name: string
}

interface ProductCreateOfferCustomErrors {
  count?: string
  missing_form_id?: string
}

export interface ProductCreateCustomErrors {
  identity?: {
    missing_form?: string
    product_type?: string
  }
  description?: {
    missing_form?: string
    bullet_points_count?: string
  }
  details?: {
    missing_form?: string
    missing_form_id?: string
  }
  media?: {
    missing_form?: string
    missing_form_id?: string
    missing_media_attachments?: string
    variants?: { [key: string /* form_id */]: { count: string } }
  }
  offer?: {
    missing_form?: string
    missing_form_id?: string
    variants?: { [key: string /* form_id */]: ProductCreateOfferCustomErrors }
    no_variants?: ProductCreateOfferCustomErrors
  }
  safety?: {
    missing_form?: string
  }
}

interface ProductsState {
  details_errors_variants: { [key: string]: Record<string, any> }
  details_errors_variants_shared: Record<string, any>
  details_errors_no_variants: Record<string, any>
  set_details_errors_variants: (errors: Record<string, any>) => void
  set_details_errors_variants_shared: (errors: Record<string, any>) => void
  set_details_errors_no_variants: (errors: Record<string, any>) => void
  offer_errors_variants: { [key: string]: Record<string, any> }
  offer_errors_no_variants: Record<string, any>
  set_offer_errors_variants: (errors: { [key: string]: Record<string, any> }) => void
  set_offer_errors_no_variants: (errors: Record<string, any>) => void
  safety_errors: Record<string, any>
  set_safety_errors: (errors: Record<string, any>) => void
  product_category_info: ProductCategoryInfo
  set_product_category_info: (value: ProductCategoryInfo) => void
  product_details_data: ProductDataResponseData | null
  set_product_details_data: (product_details_data: ProductDataResponseData) => void
  product_details_form_values: Record<string, any>
  set_product_details_form_values: (product_details_form_values: Record<string, any>) => void
  product_details_variations_form_values: ProductCreateDetailsVariationsFormValues
  set_product_details_variations_form_values: (v: ProductCreateDetailsVariationsFormValues) => void
  product_details_variations_titles: ValueLabel[]
  set_product_details_variations_titles: (titles: ValueLabel[]) => void
  product_offer_form_values: ProductCreateOfferFormValuesPayload | null
  set_product_offer_form_values: (product_offer_form: ProductCreateOfferFormValuesPayload) => void
  product_safety_form_values: Record<string, any>
  set_product_safety_form_values: (values: Record<string, any>) => void
  product_create_custom_errors: ProductCreateCustomErrors | null
  set_product_create_custom_errors: (errors: Partial<ProductCreateCustomErrors | null>) => void
}

const storeFn: StateCreator<ProductsState> = (set) => ({
  details_errors_variants: {},
  details_errors_variants_shared: {},
  details_errors_no_variants: {},
  set_details_errors_variants: (errors) => set({ details_errors_variants: errors }),
  set_details_errors_variants_shared: (details_errors_variants_shared) =>
    set({ details_errors_variants_shared }),
  set_details_errors_no_variants: (errors) => set({ details_errors_no_variants: errors }),
  offer_errors_variants: {},
  offer_errors_no_variants: {},
  set_offer_errors_variants: (offer_errors_variants) => set({ offer_errors_variants }),
  set_offer_errors_no_variants: (offer_errors_no_variants) => set({ offer_errors_no_variants }),
  safety_errors: {},
  set_safety_errors: (safety_errors) => set({ safety_errors }),
  product_category_info: { category: '', subcategory: '', category_name: '', subcategory_name: '' },
  set_product_category_info: (product_category_info) => set({ product_category_info }),
  product_details_data: null,
  set_product_details_data: (product_details_data) => set({ product_details_data }),
  product_details_form_values: {},
  set_product_details_form_values: (product_details_form_values) => set({ product_details_form_values }),
  product_details_variations_form_values: { variations: [] },
  set_product_details_variations_form_values: (product_details_variations_form_values) =>
    set({ product_details_variations_form_values }),
  product_details_variations_titles: [],
  set_product_details_variations_titles: (product_details_variations_titles: ValueLabel[]) =>
    set({ product_details_variations_titles }),
  product_offer_form_values: null,
  set_product_offer_form_values: (product_offer_form_values) => set({ product_offer_form_values }),
  product_safety_form_values: {},
  set_product_safety_form_values: (product_safety_form_values) => set({ product_safety_form_values }),
  product_create_custom_errors: null,
  set_product_create_custom_errors: (updates) =>
    set((state) => ({
      product_create_custom_errors:
        updates === null ? null : deepMerge(state.product_create_custom_errors || {}, updates),
    })),
})

export const useProductsStore =
  process.env.NODE_ENV === 'development'
    ? create<ProductsState>()(devtools(storeFn, { name: 'Products Store' }))
    : create<ProductsState>()(storeFn)
