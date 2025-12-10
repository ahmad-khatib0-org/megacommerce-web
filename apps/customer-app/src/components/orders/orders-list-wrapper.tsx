'use client'

import { ObjString } from '@megacommerce/shared'
import OrdersList from './orders-list'

type Props = {
  tr: ObjString
}

function OrdersListWrapper({ tr }: Props) {
  return <OrdersList tr={tr} />
}

export default OrdersListWrapper
