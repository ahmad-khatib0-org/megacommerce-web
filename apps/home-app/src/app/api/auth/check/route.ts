import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode, JwtPayload } from 'jwt-decode'

import { Cookies, Trans, SERVER_INTERNAL_ERROR } from '@megacommerce/shared/server'
import { system } from '@/helpers/server'

// refresh threshold here (e.g., 0.2 for 20%)
const REFRESH_THRESHOLD = 0.2

interface JwtPayloadResponse extends JwtPayload {
  id_token: {
    email: string
    first_name: string
  }
}

export async function POST(req: NextRequest) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(Cookies.AccessToken)?.value
  const refreshToken = cookieStore.get(Cookies.RefreshToken)?.value

  let config
  try {
    config = (await system()).config
  } catch (err) {
    console.error('Failed to get system config:', err)
    return NextResponse.json({ error: SERVER_INTERNAL_ERROR }, { status: 500 })
  }

  if (!refreshToken) {
    return NextResponse.json({ error: tr(lang, 'error.unauthenticated') }, { status: 401 })
  }

  let shouldRefresh = false
  let email: string | undefined
  let firstName: string | undefined

  if (accessToken) {
    try {
      const decodedToken = jwtDecode<JwtPayloadResponse>(accessToken)
      const now = Math.floor(Date.now() / 1000)

      if (decodedToken.exp && decodedToken.iat) {
        const totalLifetime = decodedToken.exp - decodedToken.iat
        const timeRemaining = decodedToken.exp - now

        // Check if the remaining time is less than 20% of the total lifetime
        if (timeRemaining / totalLifetime < REFRESH_THRESHOLD) {
          shouldRefresh = true
        }
      }

      // Extract email from the token, assuming it's in the 'email' claim
      // This depends on your OAuth provider (Hydra) configuration.
      if (decodedToken.id_token.email) {
        email = decodedToken.id_token.email
        firstName = decodedToken.id_token.first_name
      }
    } catch (error) {
      console.error('Failed to decode access token:', error)
      const response = NextResponse.json({ error: tr(lang, 'error.unauthenticated') }, { status: 401 })
      response.cookies.set(Cookies.AccessToken, '', { maxAge: 0, path: '/' })
      response.cookies.set(Cookies.RefreshToken, '', { maxAge: 0, path: '/' })
      return response
    }
  } else {
    // No access token, so we must refresh
    shouldRefresh = true
  }

  // --- CONDITIONAL TOKEN REFRESH ---
  if (shouldRefresh) {
    const oauth = config?.oauth
    try {
      const tokenResponse = await fetch(`${oauth?.oauthProviderUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${oauth?.oauthClientId}:${oauth?.oauthClientSecret}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          redirect_uri: oauth?.oauthRedirectUrl!,
        }),
      })

      if (!tokenResponse.ok) {
        // Refresh token is invalid, clear cookies and force login
        const response = NextResponse.json({ error: tr(lang, 'error.unauthenticated') }, { status: 401 })
        response.cookies.set(Cookies.AccessToken, '', { maxAge: 0, path: '/' })
        response.cookies.set(Cookies.RefreshToken, '', { maxAge: 0, path: '/' })
        return response
      }

      // Hydra responded successfully! Parse the new tokens.
      const tokens = await tokenResponse.json()
      const { access_token, refresh_token: new_refresh_token, expires_in } = tokens

      try {
        const newDecodedToken = jwtDecode<JwtPayloadResponse>(access_token)
        if (newDecodedToken.id_token.email) {
          email = newDecodedToken.id_token.email
          firstName = newDecodedToken.id_token.first_name
        }
      } catch (e) {
        console.error('Could not decode new access token to get email', e)
      }

      const response = NextResponse.json({ success: true, email, firstName }, { status: 200 })

      // Set the NEW access token cookie
      response.cookies.set(Cookies.AccessToken, access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: expires_in,
      })

      // Set the NEW refresh token cookie
      response.cookies.set(Cookies.RefreshToken, new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: config?.security?.refreshTokenExpiryInHours! * 60 * 60,
      })

      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      return NextResponse.json({ error: tr(lang, 'error.internal') }, { status: 500 })
    }
  }

  // --- NO REFRESH NEEDED ---
  // the token is still valid and we have the email.
  return NextResponse.json({ success: true, email, firstName }, { status: 200 })
}
