/**
 * ClientInformation represents essential information about a user, like
 *
 * language, currency, ship to location, ...
 */
export interface ClientInformation {
  // Basic info
  country: string
  language: string
  currency: string

  // Fingerprinting data
  fingerprint: string
  userAgent: string
  browser: {
    name: string
    version: string
    engine: string
    engineVersion: string
  }
  os: {
    name: string
    version: string
    platform: string
  }
  device: {
    type: string
    vendor: string
    model: string
    mobile: boolean
    tablet: boolean
  }
  screen: {
    width: number
    height: number
    colorDepth: number
    pixelRatio: number
  }
  timezone: string
  locale: string
  languages: string[]
  cookiesEnabled: boolean
  javaEnabled: boolean
  // Additional tracking data
  ipAddress?: string
  continent?: string
  city?: string
  region?: string
  isp?: string
  connectionType?: string
  // Timestamps
  firstSeenAt: number
  lastSeenAt: number
}

export function createDefaultClientInformation(): ClientInformation {
  const timestamp = Date.now()

  return {
    // Basic info defaults
    country: 'US',
    language: 'en',
    currency: 'USD',

    // Fingerprinting defaults
    fingerprint: 'unknown',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    browser: {
      name: 'Unknown',
      version: 'Unknown',
      engine: 'Unknown',
      engineVersion: 'Unknown',
    },
    os: {
      name: 'Unknown',
      version: 'Unknown',
      platform: typeof window !== 'undefined' ? navigator.platform : 'Unknown',
    },
    device: {
      type: 'desktop',
      vendor: 'Unknown',
      model: 'Unknown',
      mobile: false,
      tablet: false,
    },
    screen: {
      width: typeof window !== 'undefined' ? screen.width : 0,
      height: typeof window !== 'undefined' ? screen.height : 0,
      colorDepth: typeof window !== 'undefined' ? screen.colorDepth : 24,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    },
    timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    locale: typeof window !== 'undefined' ? navigator.language : 'en-US',
    languages: typeof window !== 'undefined' ? [...navigator.languages] : ['en-US'],
    cookiesEnabled: typeof window !== 'undefined' ? navigator.cookieEnabled : false,
    javaEnabled: false,

    // Timestamps
    firstSeenAt: timestamp,
    lastSeenAt: timestamp,
  }
}
