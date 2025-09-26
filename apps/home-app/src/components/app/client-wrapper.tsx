'use client'
import { useEffect, useState } from "react"

import { useAppStore } from "@/store"

type Props = {}

function ClientWrapper({ }: Props) {
  const setClientInfo = useAppStore((state) => state.setClientInfo)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return { loading }
}

export default ClientWrapper
