'use client'
import { ObjString } from '@megacommerce/shared'
import { AVAILABLE_LANGUAGES } from '@megacommerce/shared/client'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'

type Props = {
  tr: ObjString
}

function LanguageCurrencyLocation({ tr }: Props) {
  const onSave = (data: OnSave) => {
    console.log(data);
  }

  return <>
    <LanguageCurrencyLocationComp
      onSave={onSave}
      selectedCountryCode={location}
      selectedCurrency={currency}
      selectedLanguage={language}
      languages={AVAILABLE_LANGUAGES}
      shipTo={tr.shipTo}
      websiteLang={tr.websiteLang}
      language={tr.language}
      currency={tr.currency}
      save={tr.save}
    />
  </>
}

export default LanguageCurrencyLocation
