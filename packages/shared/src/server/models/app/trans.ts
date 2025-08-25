import 'server-only'

export type Translations = { [key: string]: { [key: string]: string } }

export type TransFunction = <P extends Record<string, any>>(lang: string, id: string, params?: P) => string
