import 'client-only'
import { create } from 'zustand'

import { ClientInformation } from '@megacommerce/shared/client'

interface AppState {
  clientInfo: ClientInformation
  setClientInfo: (info: ClientInformation) => void
}

export const useAppStore = create<AppState>((set) => ({
  clientInfo: { currency: "", language: "", country: "" },
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
}))
