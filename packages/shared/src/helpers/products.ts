import { PRODUCT_ID_TYPES } from '../constants'

const productIDGtinValidate = (code: string): boolean => {
  const digits = code
    .split('')
    .map(Number)
    .filter((n) => !isNaN(n))

  if (digits.length < 8 || digits.length > 14) return false

  const sum = digits.reduce((total, digit, index) => {
    const multiplier = (digits.length - index) % 2 === 0 ? 1 : 3
    return total + digit * multiplier
  }, 0)

  return sum % 10 === 0
}

const productIDIsbnValidate = (isbn: string): boolean => {
  const cleanIsbn = isbn.replace(/-/g, '')
  if (cleanIsbn.length !== 10) return false

  const sum = cleanIsbn.split('').reduce((total, char, index) => {
    let digit: number
    if (index === 9 && (char === 'X' || char === 'x')) {
      digit = 10
    } else {
      digit = parseInt(char, 10)
      if (isNaN(digit)) return total
    }
    return total + digit * (10 - index)
  }, 0)

  return sum % 11 === 0
}

export const productIDValidate = (type: PRODUCT_ID_TYPES, id: string) => {
  if (!id) return false

  switch (type) {
    case PRODUCT_ID_TYPES.Upc:
      return /^\d{12}$/.test(id) && productIDGtinValidate(id)
    case PRODUCT_ID_TYPES.Ean:
      return /^\d{13}$/.test(id) && productIDGtinValidate(id)
    case PRODUCT_ID_TYPES.Gtin:
      return /^\d{8,14}$/.test(id) && productIDGtinValidate(id)
    case PRODUCT_ID_TYPES.Isbn:
      return /^(?:\d{9}[\dX]|\d{10})$/.test(id) && productIDIsbnValidate(id)
    default:
      return false
  }
}
