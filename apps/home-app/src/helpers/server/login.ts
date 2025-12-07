import 'server-only'
const CircuitBreaker = require('opossum')

class OAuthServiceStatusChecker {
  private breaker: typeof CircuitBreaker
  static url = process.env['OAUTH_HEALTH_CHECK_URL'] as string

  constructor() {
    const options = {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      autoRenewAbortController: true,
      abortMessage: 'Hydra health check timed out',
    }

    this.breaker = new CircuitBreaker(this.checkHydraHealth.bind(this), options)
    this.setupEventListeners()
  }

  private async checkHydraHealth({ signal }: { signal?: AbortSignal } = {}): Promise<boolean> {
    try {
      const res = await fetch(OAuthServiceStatusChecker.url, {
        signal, // allows the circuit breaker to abort the request
        method: 'GET',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Hydra health status: ${res.status}`)
      }

      const healthData = await res.json()
      return healthData.status === 'ok'
    } catch (err: any) {
      // Handle abort error specifically
      if (err.name === 'AbortError') {
        console.warn('Hydra health check was aborted due to timeout')
        throw new Error('Health check timeout')
      }

      console.error('Hydra health check failed:', err)
      throw err
    }
  }

  async isOauthServiceAlive(): Promise<boolean> {
    try {
      return await this.breaker.fire()
    } catch {
      return false
    }
  }

  private setupEventListeners(): void {
    this.breaker.on('open', () => {
      console.warn('Hydra circuit breaker opened - service unavailable')
    })

    this.breaker.on('halfOpen', () => {
      console.log('Hydra circuit breaker half-open - testing service')
    })

    this.breaker.on('close', () => {
      console.log('Hydra circuit breaker closed - service available')
    })

    this.breaker.on('failure', (error: Error) => {
      console.error('Hydra health check failed:', error.message)
    })

    this.breaker.on('timeout', (error: Error) => {
      console.warn('Hydra health check timed out:', error.message)
    })

    this.breaker.on('success', (result: boolean) => {
      console.log('Hydra health check succeeded:', result)
    })

    this.breaker.on('reject', (error: Error) => {
      console.warn('Hydra health check rejected (circuit open):', error.message)
    })
  }

  getStats() {
    return this.breaker.stats
  }

  closeCircuit() {
    this.breaker.close()
  }
}

export const oauthServiceStatusChecker = new OAuthServiceStatusChecker()

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
export async function checkUserAuth(maxRetries: number = 2): Promise<AuthResult> {
  let attempt = 0
  // A simple helper function to create a delay
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  while (attempt <= maxRetries) {
    try {
      const response = await fetch('/api/auth/check', { method: 'POST', cache: 'no-store' })
      if (response.ok) {
        const data = (await response.json()) as { success: boolean; email: string; firstName: string }
        return {
          success: data.success,
          email: data.email,
          firstName: data.firstName,
          isInternalError: false,
        }
      }

      if (response.status === 401) {
        return { success: false, isInternalError: false }
      }

      if (response.status >= 400 && response.status < 500) {
        return { success: false, isInternalError: false }
      }

      if (response.status >= 500) {
        attempt++
        if (attempt <= maxRetries) {
          console.warn(`Auth check failed (server error), retrying... Attempt ${attempt} of ${maxRetries}`)
          await delay(1000 * attempt) // Wait 1s, 2s, 3s...
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
        console.warn(
          `Auth check failed (network error), retrying... Attempt ${attempt} of ${maxRetries}`,
          error
        )
        await delay(1000 * attempt)
        continue
      } else {
        // Retries exhausted
        return { success: false, isInternalError: true }
      }
    }
  }

  // Failsafe, should not be reached
  return { success: false, isInternalError: true }
}
