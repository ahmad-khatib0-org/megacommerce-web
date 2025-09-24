'use client'
import { useState } from 'react'

import { ObjString } from '@megacommerce/shared'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp } from '@megacommerce/ui/client'

type Props = {
  tr: ObjString
}

function LanguageCurrencyLocation({ tr }: Props) {
  const [selectedCountry, setSelectedCountry] = useState('France')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  return <LanguageCurrencyLocationComp selectedCountry={selectedCountry} selectedCountryCode={'fr'} selectedCurrency={selectedCurrency} shipTo={tr.shipTo} selectedLanguage={'English'} websiteLang={tr.wl} />
}

export default LanguageCurrencyLocation
