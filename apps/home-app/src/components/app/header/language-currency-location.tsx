'use client'
import { useAppStore } from '@/store'
import { ObjString, ValueLabel } from '@megacommerce/shared'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'

type Props = {
  tr: ObjString
  langs: ValueLabel[]
}

function LanguageCurrencyLocation({ tr, langs }: Props) {
  const { language, geoData } = useAppStore((state) => state.clientInfo)
  const { currency, country_code } = geoData ?? {}

  // TODO: complete the onSave function
  const onSave = (data: OnSave) => {
    console.log('Saving preferences:', data)
  }

  if (!language || !currency || !country_code) return null
  return (
    <LanguageCurrencyLocationComp
      onSave={onSave}
      selectedCountryCode={country_code}
      selectedCurrency={currency}
      selectedLanguage={language}
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
