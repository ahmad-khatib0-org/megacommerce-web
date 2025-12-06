import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// --- DEFINE CONSTANTS LOCALLY ---
// This avoids the complex transpilation issue with '@megacommerce/shared'
const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LANGUAGE_SYMBOL = 'en'
const DEFAULT_LOCATION = 'US'
const DEFAULT_LANGUAGE_NAME = 'English'

const Cookies = {
  Currency: 'currency',
  AcceptLanguage: 'accept-language',
  LanguageName: 'language-name',
  Country: 'country',
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (!request.cookies.get(Cookies.Currency)?.value) {
    response.cookies.set(Cookies.Currency, DEFAULT_CURRENCY)
  }

  if (!request.cookies.get(Cookies.AcceptLanguage)?.value) {
    response.cookies.set(Cookies.AcceptLanguage, DEFAULT_LANGUAGE_SYMBOL)
  }

  console.log('✅ Middleware is running and setting cookies if needed!')

  if (!request.cookies.get(Cookies.LanguageName)?.value) {
    response.cookies.set(Cookies.LanguageName, DEFAULT_LANGUAGE_NAME)
  }

  if (!request.cookies.get(Cookies.Country)?.value) {
    response.cookies.set(Cookies.Country, DEFAULT_LOCATION)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
