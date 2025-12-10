import 'client-only'
import { create } from 'zustand'

import { ClientInformation, createDefaultClientInformation } from '@megacommerce/shared/client'

interface AppState {
  clientInfo: ClientInformation & { email?: string; firstName?: string }
  setClientInfo: (info: ClientInformation & { email?: string; firstName?: string }) => void
  setClientEssentialInfo: (info: { languageSymbol: string; currency: string; country: string }) => void
  isAllCategoriesShown: boolean
  setIsAllCategoriesShown: (isAllCategoriesShown: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  clientInfo: createDefaultClientInformation(),
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
  setClientEssentialInfo: (info) => set((state) => ({ clientInfo: state.clientInfo, ...info })),
  isAllCategoriesShown: false,
  setIsAllCategoriesShown: (isAllCategoriesShown: boolean) => set({ isAllCategoriesShown }),
}))
