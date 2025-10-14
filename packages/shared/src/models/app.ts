export type ObjString = { [key: string]: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjAny = { [key: string]: any }

export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export interface IDName {
  id: string
  name: string
}

export interface ValueLabel {
  value: string
  label: string
}
