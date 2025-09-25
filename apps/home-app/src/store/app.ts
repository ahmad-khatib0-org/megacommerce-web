import { create } from 'zustand'
import { AppCookies } from '@megacommerce/shared/client'

interface AppState {
  appCookies: AppCookies
  setAppCookies: (appCookies: AppCookies) => void
}

export const useAppStore = create<AppState>((set) => ({
  appCookies: { currency: "", language: "", location: "" },
  setAppCookies: (appCookies: AppCookies) => set({ appCookies })
}))
