export type FileSizeUnit = 'KB' | 'MB' | 'GB'

export function getAppropriateSize(maxSize: number, unit: FileSizeUnit, decimals: number = 2): number {
  let result: number

  switch (unit) {
    case 'KB':
      result = maxSize / 1024
      break
    case 'MB':
      result = maxSize / (1024 * 1024)
      break
    case 'GB':
      result = maxSize / (1024 * 1024 * 1024)
      break
    default:
      result = maxSize / 1024
  }

  return Number(result.toFixed(decimals))
}
