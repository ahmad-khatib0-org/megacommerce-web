'use client'
import { useState } from "react"
import Image from "next/image"
import { Transition } from "@mantine/core"

import { IDName, ObjString } from "@megacommerce/shared"
import { useAppStore } from "@/store"

type Props = {
  tr: ObjString
  categories: { id: string, name: string, image: string, subcategories: IDName[] }[]
}

function Categories({ tr, categories }: Props) {
  const [current, setCurrent] = useState(0)
  const show = useAppStore((s) => s.isAllCategoriesShown)
  const setIsAllCategoriesShown = useAppStore((s) => s.setIsAllCategoriesShown)

  const onCategoryChange = (idx: number, id: string) => {
    setCurrent(idx)
  }

  return (
    <Transition mounted={show} transition={"fade"} duration={200} timingFunction="ease">
      {(trStyle) =>
        <div
          style={{ ...trStyle }}
          onMouseEnter={() => setIsAllCategoriesShown(true)}
          onMouseLeave={() => setIsAllCategoriesShown(false)}
          className="absolute z-20 my-2 min-h-[70vh] max-h-[75vh] w-screen px-6 shadow-md grid grid-cols-[33%,1fr]">
          <ul className="scrollbar-4 max-h-[70vh] bg-[#F5F5F5]">
            {categories.map((c, idx) => <li
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
          <div>
          </div>
        </div>
      }
    </Transition>
  )
}

export default Categories
