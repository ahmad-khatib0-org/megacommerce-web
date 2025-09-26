'use client'
import { useAppStore } from '@/store'
import { ObjString } from '@megacommerce/shared'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'

type Props = {
  tr: ObjString
  langs: ObjString
}

// TODO: complete the onSave function
function LanguageCurrencyLocation({ tr, langs }: Props) {
  const { currency, country, language } = useAppStore((state) => state.clientInfo)

  const onSave = (data: OnSave) => {
    console.log(data);
  }

  if (!language) return null
  return <LanguageCurrencyLocationComp
    onSave={onSave}
    selectedCountryCode={country}
    selectedCurrency={currency}
    selectedLanguage={language}
    languages={langs}
    shipTo={tr.shipTo}
    websiteLang={tr.websiteLang}
    language={tr.language}
    currency={tr.currency}
    save={tr.save}
  />
}

export default LanguageCurrencyLocation
