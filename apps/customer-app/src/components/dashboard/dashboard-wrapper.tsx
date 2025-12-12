'use client'

import { ObjString } from '@megacommerce/shared'
import Dashboard from './dashboard'

type Props = {
  tr: ObjString
}

function DashboardWrapper({ tr }: Props) {
  return <Dashboard tr={tr} />
}

export default DashboardWrapper
