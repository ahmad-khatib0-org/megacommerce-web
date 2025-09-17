import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { Trans } from "@megacommerce/shared/server";
import { encodeQueryParams, system } from "@/helpers/server";
import { Config } from "@megacommerce/proto/common/v1/config";

export async function GET(req: NextRequest) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  // TODO: include the occurred error
  const returnErr = (descID: string) => {
    const msg = tr(lang, "login.error")
    const desc = tr(lang, descID)
    const url = `/api/error?${encodeQueryParams({ error: msg, error_description: desc, translated: true })}`
    return NextResponse.redirect(url, 302)
  }

  let config: Config
  try {
    config = (await system()).config!
  } catch (err) {
    return returnErr("error.internal")
  }

  const oauth = config?.oauth

  // Verify State 
  const storedState = (await cookies()).get("oauth_state")?.value
  if (!state || state !== storedState) return returnErr('oauth.login_state.invalid')

  if (!code) return returnErr('oauth.login_code.invalid')

  // Exchange code for tokens
  const res = await fetch(`${oauth?.oauthProviderUrl}/oauth2/token`, {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: oauth?.oauthRedirectUrl! }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${oauth?.oauthClientId}:${oauth?.oauthClientSecret}`).toString("base64"),
    },
  })

  if (!res.ok) return returnErr("oauth.unknown_error")

  const tokens = await res.json()
  const { access_token, refresh_token, expires_in } = tokens

  // Set JWTs in HTTP-only cookies
  const response = NextResponse.redirect(new URL("/", req.url))

  response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" })
  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: "/",
    maxAge: expires_in
  })

  response.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: "/",
    maxAge: config?.security?.refreshTokenExpiryInHours! * 60 * 60
  })

  return response
}
