import 'server-only'
import { headers } from 'next/headers'

interface AuthResult {
  success: boolean
  email?: string
  firstName?: string
  isInternalError: boolean
}

/**
 * Reads all incoming client headers from the Next.js request and converts
 * them into a simple Record<string, string> object for forwarding to an
 * internal fetch call.
 * Note: Headers will be lowercased due to standard Web Headers API behavior.
 * @returns A Record<string, string> object containing all client headers.
 */
export async function getForwardableHeaders(): Promise<Record<string, string>> {
  const requestHeaders = await headers()
  const forwardedHeaders: Record<string, string> = {}

  requestHeaders.forEach((value, key) => {
    forwardedHeaders[key.toLowerCase()] = value
  })

  console.log('forwardedHeaders', forwardedHeaders)
  return forwardedHeaders
}

/**
 * Checks user authentication against the shared-api endpoint with retry mechanism.
 * Calls the centralized auth service in shared-api for token validation and refresh.
 * @param headers - Optional headers to forward (e.g., Cookie header from incoming request)
 * @param maxRetries - The maximum number of times to retry on internal server errors. Defaults to 2.
 * @returns An object containing the success status, user info, and an error flag.
 */
export async function getUserAuthInfo(
  headers?: Record<string, string>,
  maxRetries: number = 2
): Promise<AuthResult> {
  let attempt = 0
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const endpoint = `http://localhost:3003/api/auth/check`

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        cache: 'no-store',
        headers: { ...headers, 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        type AuthResponse = { success: boolean; email: string; firstName: string }
        const { success, email, firstName } = (await response.json()) as AuthResponse
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
      // Network error - transient
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

  // Failsafe
  return { success: false, isInternalError: true }
}
