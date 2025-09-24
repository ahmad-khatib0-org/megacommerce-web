'use client'
import { ReactNode, useMemo, useState } from "react"
import Image from 'next/image'
import { StaticImport } from "next/dist/shared/lib/get-img-props"

import { countries, currencies, FLAGS } from "../../data"
import { Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components"

type Props = {
  shipTo: string
  selectedCountry: string
  selectedCountryCode: string
  selectedCurrency: string
  selectedLanguage: string
  websiteLang: string
}

export function LanguageCurrencyLocation({ shipTo, selectedCurrency, selectedCountry, selectedCountryCode, selectedLanguage, websiteLang }: Props) {
  const countriesList = useMemo(() => countries, [])
  const currenciesList = useMemo(() => currencies, [])
  const [countryCode, setCountryCode] = useState(selectedCountryCode)
  const [country, setCountry] = useState(selectedCountry)
  const [currency, setCurrency] = useState(selectedCurrency)
  const [language, setLanguage] = useState(selectedLanguage)

  const getFlagImage = (iso2: string, size = 20): ReactNode | null => {
    const src = (FLAGS as Record<string, string | StaticImport>)[iso2.toLowerCase()]
    if (!src) return null
    return <Image src={src as string} width={size} height={(size * 3) / 4} alt={`${iso2} flag`} className="select-none" />;
  }

  return (
    <Popover>
      <PopoverTrigger className="px-2 py-1">
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center gap-x-2">
            <p className="text-sm">{shipTo}: {country}</p>
            {getFlagImage(countryCode)}
          </div>
          <div className="flex items-center gap-x-3">
            <p className="font-sm">{currency} / {language}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="border border-black/10 rounded-3xl shadow-xl flex flex-col min-h-96 max-w-80">
        <p className="font-bold text-lg mb-2">{shipTo}</p>
        <Select value={countryCode} onValueChange={(value) => {
          console.log(`the selected country ${value}`);
          setCountryCode(value)
          const selected = countries.find(c => c.code.toLowerCase() === value);
          if (selected) setCountry(selected.name);
        }}>
          <SelectTrigger className="w-full border border-black/20">
            {!countryCode && <SelectValue placeholder={websiteLang} />}
            {countryCode &&
              <div className="flex justify-center items-center gap-x-2">
                <p>{country}</p>
                {getFlagImage(countryCode)}
              </div>
            }
          </SelectTrigger>
          <SelectContent className="max-h-60 max-w-64 border border-black/20">
            {countries.map((c) => <SelectItem key={c.name} value={c.code.toLowerCase()}  >
              <div className="flex justify-center items-center gap-x-2">
                {getFlagImage(c.code.toLowerCase())}
                <p>{c.name}</p>
              </div>
            </SelectItem>)}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  )
}

