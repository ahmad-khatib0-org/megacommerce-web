/**
 * ClientInformation represents essential information about a user, like
 *
 * language, currency, ship to location, ...
 */
export interface ClientInformation {
  geoData?: LocationInfo
  language: string
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
    fingerprint: '',
    language: '',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    browser: {
      name: '',
      version: '',
      engine: '',
      engineVersion: '',
    },
    os: {
      name: '',
      version: '',
      platform: typeof window !== 'undefined' ? navigator.platform : 'Unknown',
    },
    device: {
      type: '',
      vendor: '',
      model: '',
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

export interface LocationInfo {
  ip: string
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: string
  country_code: string
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal?: string // Made optional
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org?: string // Made optional
}

export function getDefaultLocationInfo(): LocationInfo {
  return {
    ip: '',
    network: '',
    version: '',
    city: '',
    region: '',
    region_code: '',
    country: '',
    country_name: '',
    country_code: '',
    country_code_iso3: '',
    country_capital: '',
    country_tld: '',
    continent_code: '',
    in_eu: false,
    postal: undefined, // Optional property
    latitude: 0,
    longitude: 0,
    timezone: '',
    utc_offset: '',
    country_calling_code: '',
    currency: '',
    currency_name: '',
    languages: '',
    country_area: 0,
    country_population: 0,
    asn: '',
    org: undefined, // Optional property
  }
}
