export const DEFAULT_LANGUAGE_SYMBOL = 'en'
export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_COUNTRY = 'fr'
export const AVAILABLE_LANGUAGES: { [key: string]: string } = {
  en: 'English',
}

export const Cookies = {
  acceptLanguage: 'accept-language',
  userID: 'user-id',
  deviceID: 'device-id',
  currencyCode: 'currency-code',
  countryCode: 'country-code',
} as const
