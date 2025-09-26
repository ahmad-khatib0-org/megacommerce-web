import { ClientInformation } from '@megacommerce/shared/client'
import { create } from 'zustand'

interface AppState {
  clientInfo: ClientInformation
  setClientInfo: (info: ClientInformation) => void
}

export const useAppStore = create<AppState>((set) => ({
  clientInfo: { currency: "", language: "", country: "" },
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo })
}))
