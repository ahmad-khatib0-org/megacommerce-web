'use client'

import { Suspense } from 'react'
import { Loader } from '@mantine/core'
import { ObjString } from '@megacommerce/shared'
import ProductsList from './products-list'

type Props = {
  tr: ObjString
}

function ProductsListWrapper({ tr }: Props) {
  return (
    <main>
      <Suspense fallback={<div className='flex justify-center items-center h-screen'><Loader /></div>}>
        <ProductsList tr={tr} />
      </Suspense>
    </main>
  )
}

export default ProductsListWrapper
