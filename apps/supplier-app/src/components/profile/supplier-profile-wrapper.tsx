'use client'

import { Suspense } from 'react'
import { ObjString } from '@megacommerce/shared'
import SupplierProfile from './supplier-profile'

type Props = {
  tr: ObjString
}

function SupplierProfileWrapper({ tr }: Props) {
  return (
    <Suspense fallback={<div className='flex justify-center items-center min-h-screen'>{tr.loading}</div>}>
      <SupplierProfile tr={tr} />
    </Suspense>
  )
}

export default SupplierProfileWrapper
