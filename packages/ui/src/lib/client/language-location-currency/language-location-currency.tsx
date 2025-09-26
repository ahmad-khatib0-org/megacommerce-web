'use client'
import { ReactNode, useEffect, useMemo, useState } from "react"
import Image from 'next/image'
import { StaticImport } from "next/dist/shared/lib/get-img-props"

import { countries, currencies, FLAGS } from "../../data"
import { Button } from '../../shared'
import { Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components"

type Props = {
  shipTo: string
  selectedCountryCode: string
  selectedCurrency: string
  selectedLanguage: string
  websiteLang: string
  language: string
  languages: { [key: string]: string }
  currency: string
  save: string
  onSave: (data: OnSave) => void
}

export interface OnSave {
  language: string
  currency: string
  location: string
}

export function LanguageCurrencyLocation({
  shipTo,
  selectedCurrency,
  selectedCountryCode,
  selectedLanguage,
  websiteLang,
  language: languageStr,
  languages,
  currency: currencyStr,
  save,
  onSave,
}: Props) {
  const countriesList = useMemo(() => countries, [])
  const currenciesList = useMemo(() => currencies, [])

  const [countrySearch, setCountrySearch] = useState('')
  const [countryCode, setCountryCode] = useState(selectedCountryCode)
  const [country, setCountry] = useState('')
  const [currency, setCurrency] = useState(selectedCurrency)
  const [language, setLanguage] = useState(selectedLanguage)

  const filteredCountries = countriesList.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase().trim()))

  const getFlagImage = (iso2: string, size = 20): ReactNode | null => {
    const src = (FLAGS as Record<string, string | StaticImport>)[iso2.toLowerCase()]
    if (!src) return null
    return <Image src={src as string} width={size} height={(size * 3) / 4} alt={`${iso2} flag`} className="select-none" />;
  }

  const _onSave = () => onSave({ currency, language, location: currency })

  useEffect(() => {
    setCountry(countriesList.find((c) => c.code.toLowerCase() === countryCode.toLowerCase())?.name ?? "")
  }, [])

  return (
    <Popover>
      <PopoverTrigger className="px-2 py-1">
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center gap-x-2">
            <p className="font-medium line-clamp-1">{shipTo}: {country}</p>
            {getFlagImage(countryCode)}
          </div>
          <div className="flex items-center gap-x-3">
            <p className="font-medium">{currency} / {language}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col justify-between border border-black/10 rounded-3xl shadow-xl min-h-96 max-w-80">
        <div className="flex flex-col">
          <p className="font-bold text-lg mb-2">{shipTo}</p>
          <Select value={countryCode} onValueChange={(value) => {
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
            <SelectContent className="max-h-60 max-w-64 border border-black/20 bg-sugar">
              <input
                placeholder="search country..."
                onChange={(e) => setCountrySearch(e.target.value)}
                // STOP events from bubbling to the Select/Radix internals:
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                autoFocus={false}
                className="rounded-md h-8 bg-slate-100 px-1 w-full mx-1"
              />
              <div className="overflow-auto max-h-60">
                {filteredCountries.map((c) => {
                  return <SelectItem key={c.name} value={c.code.toLowerCase()}  >
                    <div className="flex justify-center items-center gap-x-2">
                      {getFlagImage(c.code.toLowerCase())}
                      <p>{c.name}</p>
                    </div>
                  </SelectItem>
                })}
              </div>
            </SelectContent>
          </Select>
          <p className="font-bold text-lg mb-2 mt-4">{languageStr}</p>
          <Select value={language} onValueChange={(value) => setLanguage(value)}>
            <SelectTrigger className="w-full border border-black/20">
              <p>{language}</p>
            </SelectTrigger>
            <SelectContent className="max-h-60 max-w-64 border border-black/20 bg-sugar">
              <div className="overflow-auto max-h-60">
                {Object.entries(languages).map(([lang, name]) => {
                  return <SelectItem key={lang} value={lang}>
                    <p>{name}</p>
                  </SelectItem>
                })}
              </div>
            </SelectContent>
          </Select>
          <p className="font-bold text-lg mb-2 mt-4">{currencyStr}</p>
          <Select value={currency} onValueChange={(value) => setCurrency(value)}>
            <SelectTrigger className="w-full border border-black/20">
              <p>{currency}</p>
            </SelectTrigger>
            <SelectContent className="max-h-60 max-w-64 border border-black/20 bg-sugar">
              <div className="overflow-auto max-h-60">
                {Object.entries(currenciesList).map(([code, data]) => {
                  return <SelectItem key={code} value={code}>
                    <p>{code} ({data.name})</p>
                  </SelectItem>
                })}
              </div>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => _onSave()} className="bg-black/90 text-white font-bold mb-2" >{save}</Button>
      </PopoverContent>
    </Popover>
  )
}

