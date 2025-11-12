import { PRODUCT_ID_TYPES } from '../constants'

/**
 * Validate GTIN-like codes (UPC, EAN, GTIN).
 * We strip non-digit chars, require length 8..14, and compute checksum
 * by applying weights starting from the RIGHT (1,3,1,3,...).
 */
const productIDGtinValidate = (code: string): boolean => {
  const digits = code
    .split('')
    .map((c) => parseInt(c, 10))
    .filter((n) => !isNaN(n))

  if (digits.length < 8 || digits.length > 14) return false

  let total = 0
  // weights start at rightmost digit = 1, then 3, then 1...
  for (let i = 0; i < digits.length; i++) {
    const fromRightIndex = digits.length - 1 - i
    const digit = digits[fromRightIndex]
    const multiplier = i % 2 === 0 ? 1 : 3
    total += digit * multiplier
  }

  return total % 10 === 0
}

/**
 * Validate ISBN-10 or ISBN-13.
 * Accepts hyphens/spaces; for ISBN-10 we apply mod-11 with possible final 'X';
 * for ISBN-13 we apply the same 1/3 weighting as EAN-13.
 */
const productIDIsbnValidate = (isbn: string): boolean => {
  const clean = isbn.replace(/[\s-]/g, '')
  // ISBN-10
  if (clean.length === 10) {
    let sum = 0
    for (let i = 0; i < 10; i++) {
      const ch = clean[i]
      let digit: number
      if (i === 9 && (ch === 'X' || ch === 'x')) {
        digit = 10
      } else {
        digit = parseInt(ch, 10)
        if (isNaN(digit)) return false
      }
      sum += digit * (10 - i)
    }
    return sum % 11 === 0
  }

  // ISBN-13 (same as EAN-13)
  if (clean.length === 13) {
    const digits = clean.split('').map((c) => parseInt(c, 10))
    if (digits.some((d) => isNaN(d))) return false
    const sum = digits.reduce((acc, d, idx) => acc + d * (idx % 2 === 0 ? 1 : 3), 0)
    return sum % 10 === 0
  }

  return false
}

export const productIDValidate = (type: PRODUCT_ID_TYPES, id: string) => {
  if (!id) return false

  switch (type) {
    case PRODUCT_ID_TYPES.Upc: {
      const cleaned = id.replace(/\D/g, '')
      return cleaned.length === 12 && productIDGtinValidate(cleaned)
    }
    case PRODUCT_ID_TYPES.Ean: {
      const cleaned = id.replace(/\D/g, '')
      return cleaned.length === 13 && productIDGtinValidate(cleaned)
    }
    case PRODUCT_ID_TYPES.Gtin: {
      const cleaned = id.replace(/\D/g, '')
      return cleaned.length >= 8 && cleaned.length <= 14 && productIDGtinValidate(cleaned)
    }
    case PRODUCT_ID_TYPES.Isbn: {
      return productIDIsbnValidate(id) // validator strips hyphens/spaces itself
    }
    default:
      return false
  }
}
