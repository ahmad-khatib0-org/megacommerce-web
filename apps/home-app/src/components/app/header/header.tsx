import 'server-only'

import SearchBar from "@/components/app/header/search-bar"
import LanguageCurrencyLocation from '@/components/app/header/language-currency-location'
import { Trans } from '@megacommerce/shared/server'

type Props = {
  userLang: string
}

const getTranslations = (lang: string) => {
  const t = Trans.tr
  return {
    shipTo: t(lang, 'location.ship_to'),
    websiteLang: t(lang, 'translation.website_language'),
    language: t(lang, 'translation.language'),
    currency: t(lang, 'currencies.currency'),
    save: t(lang, 'save'),
  }
}

const Header = ({ userLang }: Props) => {
  const tr = getTranslations(userLang)
  return (
    <section className="grid grid-cols-[auto,500px,1fr] justify-center items-center mt-2 gap-x-8">
      <a href="/" className="flex justify-center items-center text-center px-2 py-1">
        <p className="font-bold text-3xl text-black">Mega</p>
        <p className="font-bold text-3xl text-orange-600">Commerce</p>
      </a>
      <SearchBar />
      <div className='flex justify-center items-center'>
        <LanguageCurrencyLocation tr={tr} />
      </div>
    </section>
  )
}

export default Header
