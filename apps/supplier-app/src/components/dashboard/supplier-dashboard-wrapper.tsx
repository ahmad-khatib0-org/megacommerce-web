'use client'

import { Suspense } from 'react'
import { ObjString } from '@megacommerce/shared'
import SupplierDashboard from './supplier-dashboard'

type Props = {
  tr: ObjString
}

function SupplierDashboardWrapper({ tr }: Props) {
  return (
    <Suspense fallback={<div className='flex justify-center items-center min-h-screen'>{tr.loading}</div>}>
      <SupplierDashboard tr={tr} />
    </Suspense>
  )
}

export default SupplierDashboardWrapper
