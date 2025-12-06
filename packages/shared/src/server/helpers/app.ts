import 'server-only'
import { headers, cookies } from 'next/headers'

import {
  AVAILABLE_LANGUAGES,
  Cookies,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE_SYMBOL,
  DEFAULT_LOCATION,
  Headers,
} from '../constants'
import { ClientInformation } from '../models'

export async function getClientInformation(): Promise<ClientInformation & { needsCheckCookies: boolean }> {
  const h = await headers()
  const c = await cookies()

  let needsCheckCookies = false

  let currency = c.get(Cookies.Currency)?.value
  if (!currency) {
    currency = DEFAULT_CURRENCY
    needsCheckCookies = true
  }

  let languageSymbol = c.get(Cookies.AcceptLanguage)?.value
  if (!languageSymbol) {
    languageSymbol = DEFAULT_LANGUAGE_SYMBOL
    needsCheckCookies = true
  }

  let languageName = c.get(Cookies.LanguageName)?.value
  if (!languageName) {
    languageName = AVAILABLE_LANGUAGES[languageSymbol]
    needsCheckCookies = true
  }

  let location = c.get(Cookies.Country)?.value
  if (!location) {
    location = DEFAULT_LOCATION
    needsCheckCookies = true
  }

  let ip = h.get(Headers.XForwardedFor)
  if (ip) ip = ip.split(',')[0].trim()
  else ip = h.get('x-real-ip') ?? ''

  return { currency, languageSymbol, languageName, location, ip, needsCheckCookies }
}
