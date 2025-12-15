'use client'

import { Suspense } from 'react'
import { ObjString } from '@megacommerce/shared'
import InventoryList from './inventory-list'

type Props = {
  tr: ObjString
}

function InventoryListWrapper({ tr }: Props) {
  return (
    <Suspense fallback={<div className='flex justify-center items-center min-h-screen'>{tr.loading}</div>}>
      <InventoryList tr={tr} />
    </Suspense>
  )
}

export default InventoryListWrapper
