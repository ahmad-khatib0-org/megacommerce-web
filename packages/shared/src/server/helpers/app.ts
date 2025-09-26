import 'server-only'
import { headers, cookies } from 'next/headers'

import { Cookies, DEFAULT_CURRENCY, DEFAULT_LANGUAGE_SYMBOL, DEFAULT_LOCATION, Headers } from '../constants'
import { ClientInformation } from '../models'

export async function getClientInformation(): Promise<ClientInformation> {
  const h = await headers()
  const c = await cookies()

  const currency = c.get(Cookies.Currency)?.value ?? DEFAULT_CURRENCY
  const language = c.get(Cookies.AcceptLanguage)?.value ?? DEFAULT_LANGUAGE_SYMBOL
  const location = c.get(Cookies.Country)?.value ?? DEFAULT_LOCATION

  let ip = h.get(Headers.XForwardedFor)
  if (ip) ip = ip.split(',')[0].trim()
  else ip = h.get('x-real-ip') ?? ''

  return { currency, language, location, ip }
}

