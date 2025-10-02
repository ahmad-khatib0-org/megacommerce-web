'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader, Transition } from "@mantine/core"

import { IDName, ObjString } from "@megacommerce/shared"
import { useAppStore } from "@/store"
import { Assets } from "@/helpers/shared"

type Props = {
  tr: ObjString
  categories: { id: string, name: string, image: string, subcategories: IDName[] }[]
}

interface Product {
  id: string,
  name: string,
  price: number
}

function Categories({ tr, categories }: Props) {
  const [current, setCurrent] = useState(0)
  const [init, setInit] = useState(true)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const show = useAppStore((s) => s.isAllCategoriesShown)
  const setIsAllCategoriesShown = useAppStore((s) => s.setIsAllCategoriesShown)

  const onCategoryChange = async (idx: number, id: string) => {
    if (idx === current && !init) return
    setCurrent(idx)
    setProducts([])
    if (init) setInit(false)
    const products = await getProducts()
    setProducts(products)
  }

  const getProducts = async (): Promise<Product[]> => {
    setLoading(true)
    const data = [
      { id: 'id1', name: 'the name of the product', price: 22.45 },
      { id: 'id1', name: 'the name of the product', price: 22.45 },
      { id: 'id1', name: 'the name of the product and a very very very very very very very very very very very very very very very very very very very very very long text...', price: 22.45 },
      { id: 'id1', name: 'the name of the product', price: 22.45 },
    ]
    return new Promise((res, rej) => {
      setTimeout(() => {
        setLoading(false)
        res(data)
      }, 3000)
    })
  }

  useEffect(() => {
    onCategoryChange(0, categories[0].id)
  }, [])

  return (
    <Transition mounted={show} transition={"fade"} duration={200} timingFunction="ease">
      {(trStyle) =>
        <div
          style={{ ...trStyle }}
          onMouseEnter={() => setIsAllCategoriesShown(true)}
          onMouseLeave={() => setIsAllCategoriesShown(false)}
          className="grid grid-cols-[33%,1fr] absolute z-20 my-2 min-h-[70vh] max-h-[75vh] w-[98vw] border border-black/15 shadow-md bg-white">
          <ul className="scrollbar-4 max-h-[70vh] bg-[#F5F5F5] mx-4">{categories.map((c, idx) => <li
            key={c.id}
            className={`flex items-center px-4 gap-x-2 mb-3 cursor-pointer py-2 ${current === idx ? 'bg-white' : ''}`}
            onMouseEnter={() => onCategoryChange(idx, c.id)}
          >
            <div className="relative size-8">
              <Image src={c.image} alt={c.name} sizes="100%" fill style={{ objectFit: 'cover' }} />
            </div>
            <p className="font-bold text-lg">{c.name}</p>
          </li>
          )}
          </ul>
          <div className="flex flex-col pe-4">
            {loading && <div className="flex justify-center items-center h-44 w-full"><Loader /></div>}
            <ul className="grid grid-cols-4 gap-x-2 overflow-x-scroll h-max">
              {products.map((p, idx) => <li
                key={`${p.id}${idx}`}
                className="flex flex-col justify-between items-center border border-black/5 shadow-sm">
                <div className="relative h-36 w-36">
                  <Image src={Assets.imgCheckMark} alt={p.name} fill sizes="100%" style={{ objectFit: 'cover' }} />
                </div>
                <div className="flex flex-col justify-between">
                  <p className="line-clamp-2 text-sm">{p.name}</p>
                  <p className="line-clamp-2 text-lg font-bold">{p.price}$</p>
                </div>
              </li>)}
            </ul>
            <ul className="flex flex-wrap gap-x-2 m-2">
              {categories[current].subcategories.map((s) => <li key={s.id} className="bg-slate-200 rounded-full px-4 py-1 m-1">
                <Link href={`/w/${encodeURIComponent(s.id)}`}>{s.name}</Link>
              </li>)}
            </ul>
          </div>
        </div>
      }
    </Transition>
  )
}

export default Categories
