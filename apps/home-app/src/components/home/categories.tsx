'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader, Transition } from '@mantine/core'

import { CategoryNavbarProductItem } from '@megacommerce/proto/web/products/v1/category_navbar'
import { IDName, ObjString } from '@megacommerce/shared'
import { useAppStore } from '@/store'
import { useCategories } from '@/hooks'

type Props = {
  tr: ObjString
  categories: { id: string; name: string; image: string; subcategories: IDName[] }[]
}

function Categories({ tr, categories }: Props) {
  const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  const [current, setCurrent] = useState(0)
  const [products, setProducts] = useState<CategoryNavbarProductItem[]>([])
  const show = useAppStore((s) => s.isAllCategoriesShown)
  const setIsAllCategoriesShown = useAppStore((s) => s.setIsAllCategoriesShown)

  const { loading, data, fetchCategory } = useCategories()

  const onCategoryChange = async (idx: number, categoryId: string) => {
    if (idx === current) return
    setCurrent(idx)
    setProducts([])

    // Get first subcategory ID
    const subcategoryId = categories[idx].subcategories[0]?.id
    if (subcategoryId) {
      await fetchCategory(categoryId, subcategoryId)
    }
  }

  useEffect(() => {
    if (data) {
      setProducts(data.recommendedProducts)
    }
  }, [data])

  useEffect(() => {
    onCategoryChange(0, categories[0].id)
  }, [])

  return (
    <Transition mounted={show} transition={'fade'} duration={200} timingFunction='ease'>
      {(trStyle) => (
        <div
          style={{ ...trStyle }}
          onMouseEnter={() => setIsAllCategoriesShown(true)}
          onMouseLeave={() => setIsAllCategoriesShown(false)}
          className='grid grid-cols-[33%,1fr] absolute z-20 my-2 min-h-[70vh] max-h-[75vh] w-[98vw] border border-black/15 shadow-md bg-white '>
          <ul className='scrollbar-4 max-h-[70vh] bg-[#F5F5F5] mx-4'>
            {categories.map((c, idx) => (
              <li
                key={c.id}
                className={`flex items-center px-4 gap-x-2 mb-3 cursor-pointer py-2 ${current === idx ? 'bg-white' : ''
                  }`}
                onMouseEnter={() => onCategoryChange(idx, c.id)}>
                <div className='relative size-8'>
                  <Image src={c.image} alt={c.name} sizes='100%' fill style={{ objectFit: 'cover' }} />
                </div>
                <p className='font-bold text-lg'>{c.name}</p>
              </li>
            ))}
          </ul>
          <div className='flex flex-col pe-4 overflow-y-auto max-h-[70vh]'>
            {loading && (
              <div className='flex justify-center items-center h-44 w-full'>
                <Loader />
              </div>
            )}
            <ul className='grid grid-cols-4 gap-x-2 overflow-x-scroll h-max'>
              {products.map((p, idx) => (
                <li
                  key={`${p.id}${idx}`}
                  className='flex flex-col justify-between items-center border border-orange-100 hover:border-orange-400 hover:shadow-md transition-all duration-200 shadow-sm rounded'>
                  <div className='relative h-36 w-36 overflow-hidden'>
                    <Image
                      src={`${mediaHost}/${p.image}`}
                      alt={p.title}
                      fill
                      sizes='100%'
                      style={{ objectFit: 'cover' }}
                    />
                    {p.discountPercentage && p.discountPercentage > 0 && (
                      <div className='absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded'>
                        -{p.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col justify-between w-full px-2 py-2'>
                    <p className='line-clamp-2 text-sm font-medium'>{p.title}</p>
                    <div className='flex items-center gap-1'>
                      <p className='text-lg font-bold text-orange-600'>${(p.priceCents / 100).toFixed(2)}</p>
                      {p.discountPriceCents && p.discountPriceCents > 0 && (
                        <p className='text-xs text-gray-400 line-through'>
                          ${(p.discountPriceCents / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <p className='text-xs text-gray-500'>{p.soldBy}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ul className='flex flex-wrap gap-x-2 m-2'>
              {categories[current].subcategories.map((s) => (
                <li key={s.id} className='bg-slate-200 rounded-full px-4 py-1 m-1'>
                  <Link href={`/w/${encodeURIComponent(categories[current].name)}?subcategory=${s.id}`}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Transition>
  )
}

export default Categories
