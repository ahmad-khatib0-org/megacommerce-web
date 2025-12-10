'use client'
import { useEffect, useState } from 'react'

import { PageLoader } from '@megacommerce/ui/shared'
import { trackClient } from '@megacommerce/shared/client'
import { useAppStore } from '@/store'
import { getUserAuthInfo } from '@/helpers/client'

type Props = {
  clientInfo: { languageSymbol: string; country: string; currency: string; languageName: string }
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
      const enhancedClientInfo = await trackClient({}, { enableFingerprinting: true })
      const { email, firstName, success, isInternalError } = await getUserAuthInfo()
      setClientInfo({ ...enhancedClientInfo, email, firstName })
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
