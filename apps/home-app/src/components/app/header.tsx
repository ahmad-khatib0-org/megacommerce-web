import 'server-only'

import SearchBar from "@/components/app/search-bar"
import LanguageCurrencyLocation from '@/components/app/language-currency-location'

type Props = {}

const Header = ({ }: Props) => {
  return (
    <section className="grid grid-cols-[auto,500px,1fr] justify-center items-center mt-2 gap-x-8">
      <a href="/" className="flex justify-center items-center text-center px-2 py-1">
        <p className="font-bold text-3xl text-black">Mega</p>
        <p className="font-bold text-3xl text-orange-600">Commerce</p>
      </a>
      <SearchBar />
      <div className='flex justify-center items-center'>
        <LanguageCurrencyLocation />
      </div>
    </section>
  )
}

export default Header
