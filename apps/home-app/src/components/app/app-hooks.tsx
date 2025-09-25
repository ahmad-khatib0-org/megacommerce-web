'use client'
import { useEffect } from "react"

import { getAppCookies } from "@megacommerce/shared/client"
import { useAppStore } from "@/store"

type Props = {}

function AppHooks({ }: Props) {
  const setAppCookies = useAppStore((state) => state.setAppCookies)
  const { location, language, currency } = getAppCookies()

  useEffect(() => {
    setAppCookies({ location, currency, language })
  }, [])

  return {
    language,
    location,
    currency,
  }
}

export default AppHooks

