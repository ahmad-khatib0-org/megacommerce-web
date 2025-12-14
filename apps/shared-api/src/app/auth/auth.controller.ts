import { Controller, Inject, Post, Req, Res } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { jwtDecode, JwtPayload } from 'jwt-decode'

import { Config } from '@megacommerce/proto/common/v1/config'
import { Cookies, Trans } from '@megacommerce/shared/server'
import { AuthService } from './auth.service'

interface IdTokenPayload extends JwtPayload {
  email: string
  first_name: string
}

/**
 * Parse cookies from Cookie header string
 * Since cookies may come from header forwarding, not Fastify cookie parsing
 */
function parseCookieHeader(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=')
    const cleanName = name.trim()
    const cleanValue = rest.join('=').trim()
    if (cleanName && cleanValue) {
      cookies[cleanName] = cleanValue
    }
  })

  return cookies
}

/**
 * Authentication controller handling auth check endpoint
 * Validates JWT tokens and handles OAuth refresh token flow
 * Centralizes token management across all applications
 */
@Controller('auth')
export class AuthController {
  // Refresh threshold (20% of total token lifetime)
  private readonly REFRESH_THRESHOLD = 0.2

  constructor(
    private readonly authService: AuthService,
    @Inject('APP_CONFIG') private readonly config: Config // <-- INJECT the config
  ) { }

  /**
   * POST /api/auth/check
   * Checks user authentication status, refreshes tokens if needed, and returns user info
   * Called from:
   * - home-app client-side (via proxy)
   * - server-side from supplier-app and customer-app
   */
  @Post('check')
  async check(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
    try {
      const config = this.config
      // Parse cookies from two sources:
      // 1. Fastify cookie plugin (for direct requests)
      // 2. Cookie header (for forwarded requests from other Next.js apps)
      let accessToken = req.cookies[Cookies.AccessToken]
      let refreshToken = req.cookies[Cookies.RefreshToken]
      let idToken = req.cookies[Cookies.IdToken]
      let lang = req.cookies[Cookies.AcceptLanguage]

      if (!accessToken || !refreshToken) {
        const cookieHeader = req.headers.cookie
        if (cookieHeader) {
          const headerCookies = parseCookieHeader(cookieHeader)
          accessToken = accessToken || headerCookies[Cookies.AccessToken]
          refreshToken = refreshToken || headerCookies[Cookies.RefreshToken]
          idToken = idToken || headerCookies[Cookies.IdToken]
        }
      }

      // Refresh token is required
      if (!refreshToken) {
        return res.status(401).send({ error: Trans.tr('en', 'error.unauthenticated') })
      }

      let shouldRefresh = false
      let email: string | undefined
      let firstName: string | undefined

      // Try to extract user info from ID token
      if (idToken) {
        try {
          const decodedIdToken = jwtDecode<IdTokenPayload>(idToken)
          email = decodedIdToken.email
          firstName = decodedIdToken.first_name
        } catch (e) {
          console.error('Failed to decode ID token, forcing refresh or re-login', e)
          shouldRefresh = true
        }
      } else {
        shouldRefresh = true
      }

      // Check if access token needs refresh
      if (accessToken && !shouldRefresh) {
        try {
          const decodedToken = jwtDecode(accessToken)
          const now = Math.floor(Date.now() / 1000)

          if (decodedToken.exp && decodedToken.iat) {
            const totalLifetime = decodedToken.exp - decodedToken.iat
            const timeRemaining = decodedToken.exp - now
            if (timeRemaining / totalLifetime < this.REFRESH_THRESHOLD) {
              shouldRefresh = true
            }
          }
        } catch (error) {
          console.error('Failed to decode access token, forcing refresh or re-login:', error)
          shouldRefresh = true
        }
      } else if (!accessToken) {
        shouldRefresh = true
      }

      // Refresh tokens if needed
      if (shouldRefresh) {
        const oauth = config?.oauth
        if (!oauth?.oauthProviderUrl || !oauth?.oauthClientId || !oauth?.oauthClientSecret) {
          console.error('Missing OAuth configuration')
          return res.status(500).send({ error: 'Internal server error' })
        }

        try {
          const tokenResponse = await fetch(`${oauth.oauthProviderUrl}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization:
                'Basic ' +
                Buffer.from(`${oauth.oauthClientId}:${oauth.oauthClientSecret}`).toString('base64'),
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              redirect_uri: oauth.oauthRedirectUrl || '',
            }),
          })

          if (!tokenResponse.ok) {
            res.clearCookie(Cookies.AccessToken)
            res.clearCookie(Cookies.RefreshToken)
            res.clearCookie(Cookies.IdToken)
            return res.status(401).send({ error: 'Unauthenticated' })
          }

          const tokens = await tokenResponse.json()
          const {
            access_token,
            refresh_token: new_refresh_token,
            expires_in,
            id_token: new_id_token,
          } = tokens

          // Extract updated user info from new ID token
          if (new_id_token) {
            try {
              const newDecodedIdToken = jwtDecode<IdTokenPayload>(new_id_token)
              email = newDecodedIdToken.email
              firstName = newDecodedIdToken.first_name
            } catch (e) {
              console.error('Could not decode new ID token to get email/name', e)
            }
          }

          // Set new cookies using Fastify API
          const secure = process.env['NODE_ENV'] === 'production'
          const cookieOptions = {
            httpOnly: true,
            secure,
            path: '/',
            sameSite: 'lax' as const,
          }

          res.setCookie(Cookies.AccessToken, access_token, {
            ...cookieOptions,
            maxAge: expires_in,
          })

          res.setCookie(Cookies.IdToken, new_id_token, {
            ...cookieOptions,
            maxAge: expires_in,
          })

          res.setCookie(Cookies.RefreshToken, new_refresh_token, {
            ...cookieOptions,
            maxAge: (config?.security?.refreshTokenExpiryInHours || 24) * 60 * 60,
          })

          return res.status(200).send({ success: true, email, firstName })
        } catch (error) {
          console.error('Token refresh failed:', error)
          return res.status(500).send({ error: 'Internal server error' })
        }
      }

      // No refresh needed, user is authenticated
      return res.status(200).send({
        success: true,
        email,
        firstName,
      })
    } catch (error) {
      console.error('Auth check error:', error)
      return res.status(500).send({ error: 'Internal server error' })
    }
  }
}
