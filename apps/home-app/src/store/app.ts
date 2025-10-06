import 'client-only'
import { create } from 'zustand'

import { ClientInformation } from '@megacommerce/shared/client'

interface AppState {
  clientInfo: ClientInformation
  isAllCategoriesShown: boolean
  setClientInfo: (info: ClientInformation) => void
  setIsAllCategoriesShown: (isAllCategoriesShown: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  clientInfo: { currency: "", language: "", country: "" },
  isAllCategoriesShown: false,
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
  setIsAllCategoriesShown: (isAllCategoriesShown: boolean) => set({ isAllCategoriesShown })
}))
