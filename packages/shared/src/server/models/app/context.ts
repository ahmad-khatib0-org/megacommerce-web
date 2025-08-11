import 'server-only'

export interface StringMap {
  [key: string]: string
}

export interface Session {
  id: string
  token: string
  created_at: number // Unix timestamp
  expires_at: number
  last_activity_at: number
  user_id: string
  device_id: string
  roles: string
  is_oauth: boolean
  props: StringMap
}

export interface Context {
  session: Session | null
  request_id: string
  ip_address: string
  x_forwarded_for: string
  path: string
  user_agent: string
  accept_language: string
}

export function contextNew(
  session: Session | null,
  request_id: string,
  ip_address: string,
  x_forwarded_for: string,
  path: string,
  user_agent: string,
  accept_language: string,
): Context {
  return {
    session,
    request_id,
    ip_address,
    x_forwarded_for,
    path,
    user_agent,
    accept_language,
  }
}
