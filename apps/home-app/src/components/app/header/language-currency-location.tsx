'use client'
import { useAppStore } from '@/store'
import { ObjString, ValueLabel } from '@megacommerce/shared'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'
import { useEffect, useState } from 'react'

type Props = {
  tr: ObjString
  langs: ValueLabel[]
}

// TODO: complete the onSave function
function LanguageCurrencyLocation({ tr, langs }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [data, setData] = useState<{ country: string; currency: string; language: string }>({
    language: '',
    country: '',
    currency: '',
  })

  const onSave = (data: OnSave) => {
    console.log(data)
  }

  const init = () => {
    console.log('the init called')

    if (clientInfo) {
      console.log('the geo data is ', clientInfo)
      setData({
        country: clientInfo.geoData?.country_code ?? '',
        currency: clientInfo.geoData?.currency ?? '',
        language: clientInfo.language,
      })
    }
  }

  useEffect(() => {
    init()
  }, [clientInfo])

  if (!clientInfo) return null

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
