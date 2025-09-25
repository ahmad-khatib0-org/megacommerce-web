import 'client-only'
import { getCookie } from 'cookies-next/client'

import { Translations } from "./trans/index"
import { TransEN } from "./trans/en"

const transEN: Translations = TransEN

const defaultLanguage = "en"
const availableLanguages = ['en']

export const tr = {
  // TODO: implement the params functionality
  tr: <P extends Record<string, any>>(lang: string, id: keyof Translations, params?: P): string => {
    switch (lang) {
      case 'en': return transEN[id]
      default: return transEN[id]
    }
  },

  getUserLang: (): string => {
    const lang = getCookie("language")
    if (!lang) return defaultLanguage
    if (availableLanguages.includes(lang)) return lang
    return defaultLanguage
  }
}  

