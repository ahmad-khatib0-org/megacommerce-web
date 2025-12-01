import 'server-only'
import { createConnection } from 'net'
import { cookies, headers } from 'next/headers'
import { Metadata } from '@grpc/grpc-js'
import { isValid, MAX_ULID } from 'ulid'

import { Context, Session } from '../models'
import { Headers } from '../constants'

export function isValidUlid(id: string): boolean {
  if (!id) return false
  if (id.length !== MAX_ULID.length) return false
  return isValid(id)
}

export async function waitForServiceToBeReady(hostName: string, port: number, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const isOpen = await new Promise((resolve) => {
      const socket = createConnection(port, hostName)
      socket.on('error', () => resolve(false))
      socket.on('connect', () => {
        socket.end()
        resolve(true)
      })
    })

    if (isOpen) return
    await new Promise((res) => setTimeout(res, 500))
  }

  throw new Error(`the service ${hostName}:${port} is not ready or its down`)
}

export async function getContext(): Promise<Context> {
  const headersList = await headers()
  const cookieStore = await cookies()

  const getString = (key: string): string => {
    return headersList.get(key) || ''
  }

  const getInt = (key: string): number => {
    const value = getString(key)
    return parseInt(value, 10) || 0
  }

  const getBool = (key: string): boolean => {
    const value = getString(key)
    return value.toLowerCase() === 'true'
  }

  const getProps = (key: string): Map<string, string> => {
    const value = getString(key)
    const props = new Map<string, string>()

    if (!value) return props

    value.split(',').forEach((pair) => {
      const trimmed = pair.trim()
      const separatorIndex = trimmed.indexOf(':')
      if (separatorIndex > 0) {
        const k = trimmed.substring(0, separatorIndex).trim()
        const v = trimmed.substring(separatorIndex + 1).trim()
        if (k && v) {
          props.set(k, v)
        }
      }
    })

    return props
  }

  const path = headersList.get('x-path') || headersList.get(':path') || headersList.get('path') || ''

  const authToken =
    getString(Headers.Authorization) ||
    cookieStore.get('token')?.value ||
    cookieStore.get('access_token')?.value ||
    ''

  // Create session
  const session = new Session(
    getString(Headers.XSessionID),
    authToken,
    getInt(Headers.XSessionCreatedAt),
    getInt(Headers.XSessionExpiresAt),
    getInt(Headers.XLastActivityAt),
    getString(Headers.XUserID),
    getString(Headers.XDeviceID),
    getString(Headers.XRoles),
    getBool(Headers.XIsOAuth),
    getProps(Headers.XProps)
  )

  const context = Context.create(
    session,
    getString(Headers.XRequestID),
    getString(Headers.XIPAddress),
    getString(Headers.XForwardedFor),
    path,
    headersList.get(Headers.UserAgent) || '',
    headersList.get(Headers.AcceptLanguage) || ''
  )

  return context
}

export async function getMetadata(): Promise<Metadata> {
  const context = await getContext()
  const metadata = new Metadata()

  // Add session info
  if (context.session.id) {
    metadata.add(Headers.XSessionID, context.session.id)
  }
  if (context.session.token) {
    metadata.add(Headers.Authorization, context.session.token)
  }
  if (context.session.createdAt > 0) {
    metadata.add(Headers.XSessionCreatedAt, context.session.createdAt.toString())
  }
  if (context.session.expiresAt > 0) {
    metadata.add(Headers.XSessionExpiresAt, context.session.expiresAt.toString())
  }
  if (context.session.lastActivityAt > 0) {
    metadata.add(Headers.XLastActivityAt, context.session.lastActivityAt.toString())
  }
  if (context.session.userId) {
    metadata.add(Headers.XUserID, context.session.userId)
  }
  if (context.session.deviceId) {
    metadata.add(Headers.XDeviceID, context.session.deviceId)
  }
  if (context.session.roles) {
    metadata.add(Headers.XRoles, context.session.roles)
  }
  metadata.add(Headers.XIsOAuth, context.session.isOauth.toString())

  if (context.session.props.size > 0) {
    const propsString = Array.from(context.session.props.entries())
      .map(([k, v]) => `${k}:${v}`)
      .join(',')
    metadata.add(Headers.XProps, propsString)
  }

  if (context.requestId) {
    metadata.add(Headers.XRequestID, context.requestId)
  }
  if (context.ipAddress) {
    metadata.add(Headers.XIPAddress, context.ipAddress)
  }
  if (context.xForwardedFor) {
    metadata.add(Headers.XForwardedFor, context.xForwardedFor)
  }
  if (context.path) {
    metadata.add('x-path', context.path)
  }
  if (context.userAgent) {
    metadata.add(Headers.UserAgent, context.userAgent)
  }
  if (context.acceptLanguage) {
    metadata.add(Headers.AcceptLanguage, context.acceptLanguage)
  }

  return metadata
}
