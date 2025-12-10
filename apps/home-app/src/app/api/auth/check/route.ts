import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode, JwtPayload } from 'jwt-decode'

import { Cookies, Trans, SERVER_INTERNAL_ERROR } from '@megacommerce/shared/server'
import { system } from '@/helpers/server'

// refresh threshold here (e.g., 0.2 for 20%)
const REFRESH_THRESHOLD = 0.2

interface IdTokenPayload extends JwtPayload {
  email: string
  first_name: string
}

export async function POST(req: NextRequest) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(Cookies.AccessToken)?.value
  const refreshToken = cookieStore.get(Cookies.RefreshToken)?.value
  const idToken = cookieStore.get('id_token')?.value

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

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken)
      const now = Math.floor(Date.now() / 1000)

      if (decodedToken.exp && decodedToken.iat) {
        const totalLifetime = decodedToken.exp - decodedToken.iat
        const timeRemaining = decodedToken.exp - now
        // Check if the remaining time is less than 20% of the total lifetime
        if (timeRemaining / totalLifetime < REFRESH_THRESHOLD) {
          shouldRefresh = true
        }
      }
    } catch (error) {
      console.error('Failed to decode access token, forcing refresh or re-login:', error)
      shouldRefresh = true
    }
  } else {
    shouldRefresh = true
  }

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
          refresh_token: refreshToken!, // Safe to assert: checked at the top
          redirect_uri: oauth?.oauthRedirectUrl!,
        }),
      })

      if (!tokenResponse.ok) {
        const response = NextResponse.json({ error: tr(lang, 'error.unauthenticated') }, { status: 401 })
        response.cookies.set(Cookies.AccessToken, '', { maxAge: 0, path: '/' })
        response.cookies.set(Cookies.RefreshToken, '', { maxAge: 0, path: '/' })
        response.cookies.set('id_token', '', { maxAge: 0, path: '/' }) // Clear ID token too
        return response
      }

      const tokens = await tokenResponse.json()
      const { access_token, refresh_token: new_refresh_token, expires_in, id_token: new_id_token } = tokens // 2. Destructure new_id_token

      if (new_id_token) {
        try {
          const newDecodedIdToken = jwtDecode<IdTokenPayload>(new_id_token)
          email = newDecodedIdToken.email
          firstName = newDecodedIdToken.first_name
        } catch (e) {
          console.error('Could not decode new ID token to get email/name', e)
        }
      }

      const response = NextResponse.json({ success: true, email, firstName }, { status: 200 })
      const secure = process.env.NODE_ENV === 'production' && req.nextUrl.protocol === 'https:'

      // Set the NEW access token cookie
      response.cookies.set(Cookies.AccessToken, access_token, {
        httpOnly: true,
        secure,
        path: '/',
        maxAge: expires_in,
        sameSite: 'lax',
      })

      // 4. Set the NEW ID token cookie
      response.cookies.set('id_token', new_id_token, {
        httpOnly: true,
        secure,
        path: '/',
        maxAge: expires_in,
        sameSite: 'lax',
      })

      // Set the NEW refresh token cookie
      response.cookies.set(Cookies.RefreshToken, new_refresh_token, {
        httpOnly: true,
        secure,
        path: '/',
        maxAge: config?.security?.refreshTokenExpiryInHours! * 60 * 60,
        sameSite: 'lax',
      })

      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      return NextResponse.json({ error: tr(lang, 'error.internal') }, { status: 500 })
    }
  }

  // --- NO REFRESH NEEDED ---
  // User info (email, firstName) was already retrieved from the existing idToken.
  return NextResponse.json({ success: true, email, firstName }, { status: 200 })
}
