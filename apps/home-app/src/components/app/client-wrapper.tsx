'use client'
import { useEffect, useState } from 'react'

import { PageLoader } from '@megacommerce/ui/shared'
import { trackClient } from '@megacommerce/shared/client'
import { useAppStore } from '@/store'

type Props = {
  clientInfo: { language: string; country: string; currency: string }
}

function ClientWrapper({ clientInfo }: Props) {
  const setClientInfo = useAppStore((state) => state.setClientInfo)
  const setClientEssentialInfo = useAppStore((state) => state.setClientEssentialInfo)
  const [loading, setLoading] = useState(false)

  const init = async () => {
    if (loading) return
    setLoading(true)
    setClientEssentialInfo(clientInfo)

    try {
      const enhancedClientInfo = await trackClient(clientInfo, {
        enableFingerprinting: true,
        enableGeoIP: true,
        timeout: 3000,
      })
      setClientInfo({ ...enhancedClientInfo })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) return <PageLoader />
  return null
}

export default ClientWrapper
