import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ClientInformation, createDefaultClientInformation } from '@megacommerce/shared/client'

interface AppState {
  clientInfo: ClientInformation & { email?: string; firstName?: string }
  setClientInfo: (info: ClientInformation & { email?: string; firstName?: string }) => void
  clientInitialInfo: { language: string; currency: string; country: string }
  setClientEssentialInfo: (info: { language: string; currency: string; country: string }) => void
}

const storeFn: StateCreator<AppState> = (set) => ({
  clientInfo: createDefaultClientInformation(),
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
  clientInitialInfo: { language: '', currency: '', country: '' },
  setClientEssentialInfo: (info) => set((state) => ({ clientInfo: state.clientInfo, ...info })),
})

export const useAppStore =
  process.env.NODE_ENV === 'development'
    ? create<AppState>()(devtools(storeFn, { name: 'App Store' }))
    : create<AppState>()(storeFn)
