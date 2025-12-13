import { NextRequest, NextResponse } from 'next/server'

/**
 * Lightweight proxy endpoint for client-side auth checks.
 * Forwards requests to the shared-api service.
 */
export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.SHARED_API_URL}/api/auth/check`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    })

    const data = await response.json()

    const res = NextResponse.json(data, { status: response.status })

    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      res.headers.set('set-cookie', setCookieHeader)
    }

    return res
  } catch (error) {
    console.error('Auth check proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
