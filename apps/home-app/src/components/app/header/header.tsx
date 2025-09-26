import 'server-only'

import SearchBar from "@/components/app/header/search-bar"
import LanguageCurrencyLocation from '@/components/app/header/language-currency-location'
import Account from '@/components/app/header/account'
import Cart from '@/components/app/header/cart'

import { AVAILABLE_LANGUAGES, Trans } from '@megacommerce/shared/server'

type Props = {
  userLang: string
}

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    shipTo: tr(lang, 'location.ship_to'),
    websiteLang: tr(lang, 'translation.website_language'),
    language: tr(lang, 'translation.language'),
    currency: tr(lang, 'currencies.currency'),
    save: tr(lang, 'save'),
    welcome: tr(lang, 'welcome'),
    signin: tr(lang, 'signin'),
    register: tr(lang, 'register'),
    cart: tr(lang, 'cart'),
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
      <div className='grid grid-cols-[minmax(0,1fr),minmax(0,1fr),max-content] items-center'>
        <LanguageCurrencyLocation tr={tr} langs={AVAILABLE_LANGUAGES} />
        <Account tr={tr} />
        <Cart tr={tr} />
      </div>
    </section>
  )
}

export default Header
