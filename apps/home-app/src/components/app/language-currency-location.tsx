'use client'

import { AVAILABLE_LANGUAGES } from '@megacommerce/shared/client'
import { LanguageCurrencyLocation as LanguageCurrencyLocationComp, OnSave } from '@megacommerce/ui/client'

import AppHooks from '@/components/app/app-hooks'
import { tr } from '@/helpers/client'

type Props = {}

function LanguageCurrencyLocation({ }: Props) {
  const { language, currency, location } = AppHooks({})
  const lang = tr.getUserLang()
  const t = tr.tr

  const onSave = (data: OnSave) => {
    console.log(data);
  }

  return <LanguageCurrencyLocationComp
    onSave={onSave}
    selectedCountryCode={location}
    selectedCurrency={currency}
    selectedLanguage={language}
    languages={AVAILABLE_LANGUAGES}
    shipTo={t(lang, 'location.ship_to')}
    websiteLang={t(lang, 'translation.website_language')}
    language={t(lang, 'translation.language')}
    currency={t(lang, 'currencies.currency')}
    save={t(lang, 'save')}
  />
}

export default LanguageCurrencyLocation
