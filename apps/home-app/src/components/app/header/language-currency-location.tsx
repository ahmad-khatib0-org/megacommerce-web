'use client'
import { useAppStore } from '@/store'
import { ObjString, ValueLabel } from '@megacommerce/shared'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'
import { useEffect, useState } from 'react'

type Props = {
  tr: ObjString
  langs: ValueLabel[]
  initialClientInfo?: {
    languageSymbol: string
    location: string
    currency: string
    languageName: string
  }
}

// TODO: complete the onSave function
function LanguageCurrencyLocation({ tr, langs, initialClientInfo }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [data, setData] = useState<{ country: string; currency: string; language: string }>({
    country: initialClientInfo?.location ?? '',
    currency: initialClientInfo?.currency ?? '',
    language: initialClientInfo?.languageSymbol ?? '',
  })

  useEffect(() => {
    if (clientInfo && clientInfo.geoData) {
      setData({
        country: clientInfo.geoData.country_code,
        currency: clientInfo.geoData.currency,
        language: clientInfo.language,
      })
    }
  }, [clientInfo])

  const onSave = (data: OnSave) => {
    console.log('Saving preferences:', data)
  }

  if (!data.language && !initialClientInfo) return null

  return (
    <LanguageCurrencyLocationComp
      onSave={onSave}
      selectedCountryCode={data.country}
      selectedCurrency={data.currency}
      selectedLanguage={data.language}
      languages={langs}
      shipTo={tr.shipTo}
      websiteLang={tr.websiteLang}
      language={tr.language}
      currency={tr.currency}
      save={tr.save}
    />
  )
}

export default LanguageCurrencyLocation
