import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ClientInformation } from '@megacommerce/shared/client'

interface AppState {
  clientInfo: ClientInformation
  setClientInfo: (info: ClientInformation) => void
}

const storeFn: StateCreator<AppState> = (set) => ({
  clientInfo: { currency: '', language: '', country: '' },
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
})

export const useAppStore =
  process.env.NODE_ENV === 'development'
    ? create<AppState>()(devtools(storeFn, { name: 'App Store' }))
    : create<AppState>()(storeFn)

