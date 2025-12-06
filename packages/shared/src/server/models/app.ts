export type Translations = { [key: string]: { [key: string]: string } }

export type TransFunction = <P extends Record<string, any>>(lang: string, id: string, params?: P) => string

export interface ClientInformation {
  languageSymbol: string
  languageName: string
  currency: string
  location: string
  ip: string
}
