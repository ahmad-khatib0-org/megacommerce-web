import { PaymentMethod } from '@megacommerce/proto/orders/v1/payment_method'

export const getPaymentMethodIcon = (type: string) => {
  switch (type) {
    case 'card':
      return 'IconCreditCard'
    case 'paypal':
      return 'IconBrandPaypal'
    case 'apple':
      return 'IconBrandApple'
    case 'google':
      return 'IconBrandGoogle'
    default:
      return 'IconCreditCard'
  }
}

export const getPaymentMethodBackground = (type: string) => {
  switch (type) {
    case 'card':
      return 'bg-blue-50'
    case 'paypal':
      return 'bg-blue-100'
    case 'apple':
      return 'bg-gray-100'
    case 'google':
      return 'bg-red-50'
    default:
      return 'bg-gray-50'
  }
}

export const getPaymentMethodIconColor = (type: string) => {
  switch (type) {
    case 'card':
      return 'text-blue-600'
    case 'paypal':
      return 'text-blue-700'
    case 'apple':
      return 'text-gray-800'
    case 'google':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '')
  return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
}

export const validateExpiry = (expiry: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!regex.test(expiry)) return false

  const [month, year] = expiry.split('/')
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1

  const expiryYear = parseInt(year, 10)
  const expiryMonth = parseInt(month, 10)

  if (expiryYear < currentYear) return false
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false

  return true
}

export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc)
}

export const checkDuplicatePaymentMethod = (
  paymentMethods: PaymentMethod[],
  lastFour: string,
  type: string
): boolean => {
  return paymentMethods.some((method) => method.lastFour === lastFour && method.type === type)
}
