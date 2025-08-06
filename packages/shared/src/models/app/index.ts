export * from './context'
export * from './trans'

/// Toast
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type ToastType = 'success' | 'warning' | 'error'

/**
 * @field time in milliseconds
 */
export interface ToastItem {
  id: string
  message: string
  type: ToastType
  time?: number
}
