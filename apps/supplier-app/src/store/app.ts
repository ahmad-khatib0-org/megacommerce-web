import 'client-only'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ClientInformation, UploadFileStatus } from '@megacommerce/shared/client'

export interface Uploader {
  show_uploader: boolean
  uploads: UploadFileStatus[]
}

interface AppState {
  clientInfo: ClientInformation
  setClientInfo: (info: ClientInformation) => void
  uploader: Uploader,
  setUploader: (uploader: Uploader) => void
}

const storeFn: StateCreator<AppState> = (set) => ({
  clientInfo: { currency: '', language: '', country: '' },
  setClientInfo: (clientInfo: ClientInformation) => set({ clientInfo }),
  uploader: { show_uploader: false, uploads: [] },
  setUploader: (uploader: Uploader) => set({ uploader })
})

export const useAppStore =
  process.env.NODE_ENV === 'development'
    ? create<AppState>()(devtools(storeFn, { name: 'App Store' }))
    : create<AppState>()(storeFn)

