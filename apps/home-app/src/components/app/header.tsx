import 'server-only'
import { ObjString } from "@megacommerce/shared"
import SearchBar from "@/components/app/search-bar"

type Props = {
  tr: ObjString
}

const Header = ({ tr }: Props) => {
  return (
    <section className="grid grid-cols-[auto,500px,1fr] justify-center items-center mt-2 gap-x-8">
      <a href="/" className="flex justify-center items-center text-center px-2 py-1">
        <p className="font-bold text-3xl text-black">Mega</p>
        <p className="font-bold text-3xl text-orange-600">Commerce</p>
      </a>
      <SearchBar tr={tr} />
    </section>
  )
}

export default Header
