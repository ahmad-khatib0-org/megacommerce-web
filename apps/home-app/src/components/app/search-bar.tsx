'use client'
import { useEffect, useMemo } from 'react'
import { IconSearch } from '@tabler/icons-react'

import { debounce, ObjString } from "@megacommerce/shared"

type Props = {
  tr: ObjString
}

function SearchBar({ tr }: Props) {
  const onSearch = async (term: string) => {
    console.log(term);
  }

  const debouncedSearch = useMemo(() => debounce(onSearch, 300), [onSearch])

  useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  return (
    <div className="grid items-center justify-center grid-cols-[1fr,40px] rounded-lg ps-2 h-10 border border-black/80">
      <input type="text" name='search' placeholder={tr.placeholder} onChange={(e) => debouncedSearch(e.target.value)}
        className="border border-transparent focus:border-transparent focus:outline-none focus:shadow-none selection:text-white selection:bg-orange-500"
      />
      <div className="flex justify-center items-center bg-black/90 h-full hover:cursor-pointer">
        <IconSearch size={24} color='white' />
      </div>
    </div>
  )
}

export default SearchBar
