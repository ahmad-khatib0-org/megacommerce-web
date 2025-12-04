import 'client-only'
import { create } from 'zustand'
import { ProductOffer } from '@megacommerce/proto/products/v1/product'

interface ProductState {
  offer: ProductOffer | null
  currency: string
}

interface ProductActions {
  initProductData: (data: { offer: ProductOffer; currencyCode: string }) => void
}

export const useProductStore = create<ProductState & ProductActions>((set) => ({
  offer: null,
  currency: '',
  initProductData: (data) => set({ offer: data.offer, currency: data.currencyCode }),
}))
