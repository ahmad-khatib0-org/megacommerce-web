import 'server-only'
import { cookies, headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserPasswordMaxLength,
  UserPasswordMinLength,
} from '@megacommerce/shared'
import { Cookies, Trans } from '@megacommerce/shared/server'
import { UserNameMaxLength, UserNameMinLength } from '@megacommerce/shared'

export async function getPasswordRequirements() {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  return [
    { re: '[0-9]', label: tr(lang, 'password.numbers') },
    { re: '[a-z]', label: tr(lang, 'password.lowercase') },
    { re: '[A-Z]', label: tr(lang, 'password.uppercase') },
    { re: "[$&+,:;=?@#|'<>.^*()%!-]", label: tr(lang, 'password.symbols') },
  ]
}

export async function getSignupPageTrans(): Promise<ObjString> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const trans = {
    s1Label: tr(lang, 'personal_info'),
    s2Label: tr(lang, 'auth_info'),
    clickNx: tr(lang, 'click_next_instead'),
    un: tr(lang, 'username'),
    fn: tr(lang, 'first_name'),
    ln: tr(lang, 'last_name'),
    email: tr(lang, 'email'),
    pass: tr(lang, 'password'),
    passConf: tr(lang, 'password_confirmation'),
    unLenErr: tr(lang, 'user.create.username.error', { Min: UserNameMinLength, Max: UserNameMaxLength }),
    unValErr: tr(lang, 'user.create.username.valid.error'),
    fnErr: tr(lang, 'user.create.first_name.error', {
      Min: UserFirstNameMinLength,
      Max: UserFirstNameMaxLength,
    }),
    lnErr: tr(lang, 'user.create.last_name.error', {
      Min: UserLastNameMinLength,
      Max: UserLastNameMaxLength,
    }),
    emailErr: tr(lang, 'user.create.email.error'),
    passMinErr: tr(lang, 'password.min_length', { Min: UserPasswordMinLength }),
    passMaxErr: tr(lang, 'password.max_length', { Max: UserPasswordMaxLength }),
    r: tr(lang, 'required'),
    passConfErr: tr(lang, 'password_confirmation.do_not_much'),
    correct: tr(lang, 'form.fields.invalid'),
    createAcc: tr(lang, 'account.create'),
    prev: tr(lang, 'previous'),
    next: tr(lang, 'next'),
    cancel: tr(lang, 'cancel'),
    profileImg: tr(lang, 'user.profile_information.image'),
    optionaImg: tr(lang, 'user.profile_information.optional_image'),
  }

  return trans
}

interface AuthResult {
  success: boolean
  email?: string
  firstName?: string
  isInternalError: boolean
}

/**
 * Checks user authentication with a retry mechanism.
 * @param headers - Optional headers to forward (e.g., Cookie header)
 * @param maxRetries - The maximum number of times to retry on internal server errors. Defaults to 2.
 * @returns An object containing the success status, user info, and an error flag.
 */
export async function getUserAuthInfo(
  headers?: Record<string, string>,
  maxRetries: number = 2
): Promise<AuthResult> {
  let attempt = 0
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  while (attempt <= maxRetries) {
    try {
      const endpoint = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/check'
      const response = await fetch(endpoint, {
        method: 'POST',
        cache: 'no-store',
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        type response = { success: boolean; email: string; firstName: string }
        const { success, email, firstName } = (await response.json()) as response
        return { success, email, firstName, isInternalError: false }
      }

      if (response.status >= 400 && response.status < 500) {
        return { success: false, isInternalError: false }
      }

      if (response.status >= 500) {
        attempt++
        if (attempt <= maxRetries) {
          console.warn(`Auth check failed (server error), retrying... Attempt ${attempt} of ${maxRetries}`)
          await delay(1000 * attempt)
          continue
        } else {
          return { success: false, isInternalError: true }
        }
      }
    } catch (error) {
      // --- NETWORK ERROR ---
      // The fetch itself failed (e.g., DNS, CORS, offline). This is transient.
      attempt++
      if (attempt <= maxRetries) {
        const msg = `Auth check failed (network error), retrying... Attempt ${attempt} of ${maxRetries}`
        console.warn(msg, error)
        await delay(1000 * attempt)
        continue
      } else {
        return { success: false, isInternalError: true }
      }
    }
  }

  // Failsafe, should not be reached
  return { success: false, isInternalError: true }
}

/**
 * Reads all incoming client headers from the Next.js request and converts
 * them into a simple Record<string, string> object for forwarding to an
 * internal fetch call.
 * * Note: Headers will be lowercased due to standard Web Headers API behavior.
 * * @returns A Record<string, string> object containing all client headers.
 */
export async function getForwardableHeaders(): Promise<Record<string, string>> {
  const requestHeaders = headers()
  const forwardedHeaders: Record<string, string> = {}

  for (const [key, value] of (await requestHeaders).entries()) {
    forwardedHeaders[key] = value
  }

  return forwardedHeaders
}

const LOGIN_PAGE_URL = process.env.LOGIN_PAGE_URL || ''

export async function redirectToAuthStatus(redirectTo: string): Promise<void> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(Cookies.RefreshToken)?.value
  if (refreshToken) {
    redirect(redirectTo, RedirectType.replace)
  } else {
    redirect(LOGIN_PAGE_URL)
  }
}
