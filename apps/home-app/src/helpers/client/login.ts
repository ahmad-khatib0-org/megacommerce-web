import 'client-only'
import { getCookie, setCookie } from 'cookies-next/client'

export class LoginHelpers {
  constructor() { }

  private static clientID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!
  private static redirectURL = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL!
  private static oauthURL = process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!

  static prepareLoginUrl(): URL {
    const state = crypto.randomUUID()

    setCookie('oauth_state', state, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300,
    })

    const url = new URL(this.oauthURL)
    url.searchParams.set('client_id', this.clientID)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'openid offline')
    url.searchParams.set('redirect_uri', this.redirectURL)
    url.searchParams.set('state', state)

    return url
  }

  /**
   * Check if we're in a Hydra login flow (has login_challenge)
   * OR if we need to start a new OAuth flow
   */
  static checkLoginUrl(currentUrl: string): URL | undefined {
    try {
      const url = new URL(currentUrl)

      // If we have a login_challenge, we're in Hydra flow - don't redirect
      if (url.searchParams.get('login_challenge')) return undefined

      // Otherwise, check if we have all OAuth parameters for a new flow
      const requiredParams = ['client_id', 'response_type', 'scope', 'redirect_uri', 'state']

      for (const param of requiredParams) {
        const value = url.searchParams.get(param)
        if (!value || value.trim() === '') {
          return this.prepareLoginUrl()
        }
      }

      const state = url.searchParams.get('state')
      const stateCookie = getCookie('oauth_state') as string

      if (!stateCookie || stateCookie !== state) {
        return this.prepareLoginUrl()
      }

      return undefined
    } catch (error) {
      return this.prepareLoginUrl()
    }
  }

  static getLoginChallengeParam(location: string): string {
    try {
      const url = new URL(location)
      return url.searchParams.get('login_challenge') ?? ''
    } catch {
      return ''
    }
  }
}

interface AuthResult {
  success: boolean
  email?: string
  firstName?: string
  isInternalError: boolean
}

/**
 * Checks user authentication with a retry mechanism.
 * @param maxRetries - The maximum number of times to retry on
 * internal server errors. Defaults to 2.
 * @returns An object containing the success status, user info, and an error flag.
 */
export async function getUserAuthInfo(maxRetries: number = 2): Promise<AuthResult> {
  let attempt = 0
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  while (attempt <= maxRetries) {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
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
