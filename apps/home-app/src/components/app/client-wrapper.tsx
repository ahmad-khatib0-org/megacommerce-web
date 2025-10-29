'use client'
import { useEffect, useState } from 'react'

import { PageLoader } from '@megacommerce/ui/shared'
import { ClientInformation } from '@megacommerce/shared/client'
import { useAppStore } from '@/store'

type Props = {
  clientInfo: ClientInformation
}

function ClientWrapper({ clientInfo }: Props) {
  const setClientInfo = useAppStore((state) => state.setClientInfo)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setClientInfo({ ...clientInfo })
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) return <PageLoader />
  return null
}

export default ClientWrapper
