import { UAParser } from 'ua-parser-js'
import { Agent, load } from '@fingerprintjs/fingerprintjs'
import { ClientInformation } from '../models/client-information'

export interface TrackClientOptions {
  enableFingerprinting?: boolean
  enableGeoIP?: boolean
  timeout?: number
}

class ClientTracker {
  private fpPromise: Promise<Agent | null> | null = null

  constructor() {
    this.initializeFingerprintJS()
  }

  private initializeFingerprintJS() {
    if (typeof window === 'undefined') return

    this.fpPromise = load({}).catch(() => null)
  }

  private parseUserAgent(ua: string) {
    const parser = new UAParser(ua)
    const result = parser.getResult()

    return {
      browser: {
        name: result.browser.name || 'Unknown',
        version: result.browser.version || 'Unknown',
        engine: result.engine.name || 'Unknown',
        engineVersion: result.engine.version || 'Unknown',
      },
      os: {
        name: result.os.name || 'Unknown',
        version: result.os.version || 'Unknown',
        platform: navigator.platform,
      },
      device: {
        type: result.device.type || 'desktop',
        vendor: result.device.vendor || 'Unknown',
        model: result.device.model || 'Unknown',
        mobile: result.device.type === 'mobile',
        tablet: result.device.type === 'tablet',
      },
    }
  }

  private getScreenInfo() {
    return {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
    }
  }

  private getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      languages: navigator.languages as string[],
      cookiesEnabled: navigator.cookieEnabled,
      javaEnabled: true,
    }
  }

  async getFingerprint(): Promise<string> {
    if (!this.fpPromise) return 'unknown'

    try {
      const fp = await this.fpPromise
      if (!fp) return 'unknown'

      const result = await fp.get()
      return result.visitorId
    } catch (error) {
      console.error('failed to get client information, error:', error)
      return 'unknown'
    }
  }

  async trackClient(
    baseInfo: Pick<ClientInformation, 'country' | 'language' | 'currency'>,
    options: TrackClientOptions = {}
  ): Promise<ClientInformation> {
    const { enableFingerprinting = true, enableGeoIP = false, timeout = 5000 } = options

    if (typeof window === 'undefined') {
      throw new Error('Client tracking is only available in browser environment')
    }

    const timestamp = Date.now()
    const browserInfo = this.getBrowserInfo()
    const screenInfo = this.getScreenInfo()
    const uaInfo = this.parseUserAgent(browserInfo.userAgent)

    // Get fingerprint (with timeout)
    let fingerprint = 'unknown'
    if (enableFingerprinting) {
      try {
        fingerprint = await Promise.race([
          this.getFingerprint(),
          new Promise<string>((resolve) => setTimeout(() => resolve('timeout'), timeout)),
        ])
      } catch (error) {
        console.error('timeout or error on getting client information:', error)
        fingerprint = 'error'
      }
    }

    // Get geo data if enabled
    let geoData = {}
    if (enableGeoIP) {
      geoData = await this.getGeoData().catch(() => ({}))
    }

    return {
      ...baseInfo,
      fingerprint,
      userAgent: browserInfo.userAgent,
      browser: uaInfo.browser,
      os: uaInfo.os,
      device: uaInfo.device,
      screen: screenInfo,
      timezone: browserInfo.timezone,
      locale: browserInfo.locale,
      languages: browserInfo.languages,
      cookiesEnabled: browserInfo.cookiesEnabled,
      javaEnabled: browserInfo.javaEnabled,
      firstSeenAt: timestamp,
      lastSeenAt: timestamp,
      ...geoData,
    }
  }

  private async getGeoData() {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) throw new Error('Geo IP failed')

      const data = await response.json()
      return {
        ipAddress: data.ip,
        continent: data.continent_code,
        country: data.country_name,
        city: data.city,
        region: data.region,
        isp: data.org,
        connectionType: data.asn,
      }
    } catch (error) {
      console.error('Geo IP error:', error)
      return {}
    }
  }

  // Utility to update last seen timestamp
  updateLastSeen(clientInfo: ClientInformation): ClientInformation {
    return {
      ...clientInfo,
      lastSeenAt: Date.now(),
    }
  }

  // Check if client data has changed significantly
  hasClientChanged(oldData: ClientInformation, newData: ClientInformation): boolean {
    return (
      oldData.fingerprint !== newData.fingerprint ||
      oldData.userAgent !== newData.userAgent ||
      oldData.screen.width !== newData.screen.width ||
      oldData.screen.height !== newData.screen.height
    )
  }
}

// Singleton instance
export const clientTracker = new ClientTracker()

// Convenience function
export async function trackClient(
  baseInfo: Pick<ClientInformation, 'country' | 'language' | 'currency'>,
  options?: TrackClientOptions
): Promise<ClientInformation> {
  return clientTracker.trackClient(baseInfo, options)
}
