import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { Cookies } from '@megacommerce/shared/server'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const response = NextResponse.json({ success: true }, { status: 200 })

  // Clear all auth-related cookies
  response.cookies.set(Cookies.AccessToken, '', { maxAge: 0, path: '/' })
  response.cookies.set(Cookies.RefreshToken, '', { maxAge: 0, path: '/' })
  response.cookies.set('id_token', '', { maxAge: 0, path: '/' })

  return response
}
