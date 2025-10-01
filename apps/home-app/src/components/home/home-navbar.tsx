'use client'
import { IconBurger } from "@tabler/icons-react"
import { ObjString } from "@megacommerce/shared"
import { useAppStore } from "@/store"

type Props = {
  tr: ObjString
}

function HomeNavbar({ tr }: Props) {
  const setIsAllCategoriesShown = useAppStore((state) => state.setIsAllCategoriesShown)
  return (
    <section className="flex gap-x-4 mx-4">
      <div
        className="bg-slate-100 flex justify-center gap-x-3 px-8 py-1 rounded-2xl"
        onMouseOver={() => setIsAllCategoriesShown(true)}
        onMouseLeave={() => setIsAllCategoriesShown(false)}
      >
        <IconBurger />
        <p>{tr.allCats}</p>
      </div>
    </section>
  )
}

export default HomeNavbar

