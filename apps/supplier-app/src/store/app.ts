import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  ClientInformation,
  createDefaultClientInformation,
  UploadFileStatus,
} from '@megacommerce/shared/client'

export interface Uploader {
  show_uploader: boolean
  uploads: UploadFileStatus[]
}

interface AppState {
  clientInfo: ClientInformation & { email?: string; firstName?: string }
  setClientInfo: (info: ClientInformation & { email?: string; firstName?: string }) => void
  setClientEssentialInfo: (info: {
    languageName: string
    languageSymbol: string
    currency: string
    country: string
  }) => void
  clientEssentialInfo: { languageName: string; languageSymbol: string; currency: string; country: string }
  updateClientInfo: (updates: Partial<ClientInformation> & { email?: string; firstName?: string }) => void
  uploader: Uploader
  setUploader: (uploader: Uploader) => void
}

const storeFn: StateCreator<AppState> = (set) => ({
  clientInfo: createDefaultClientInformation(),
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
  clientEssentialInfo: { languageName: '', languageSymbol: '', currency: '', country: '' },
  setClientEssentialInfo: (info) => set((state) => ({ clientInfo: state.clientInfo, ...info })),
  uploader: { show_uploader: false, uploads: [] },
  setUploader: (uploader: Uploader) => set({ uploader }),
  updateClientInfo: (updates) =>
    set((state) => ({
      clientInfo: { ...state.clientInfo, ...updates },
    })),
})

export const useAppStore =
  process.env.NODE_ENV === 'development'
    ? create<AppState>()(devtools(storeFn, { name: 'App Store' }))
    : create<AppState>()(storeFn)
