export interface TransEntry {
  id: string
  tr: string
}

export type Translations = { [key: string]: TransEntry[] }
