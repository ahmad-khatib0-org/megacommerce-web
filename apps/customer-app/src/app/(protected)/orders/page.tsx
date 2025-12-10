import { Trans } from '@megacommerce/shared/server'
import OrdersListWrapper from '@/components/orders/orders-list-wrapper'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getTranslations(lang: string) {
  const tr = Trans.tr
  return {
    myOrders: tr(lang, 'orders.my_orders'),
    trackManage: tr(lang, 'orders.track_manage'),
    orderNumber: tr(lang, 'orders.order_number'),
    orderStatus: tr(lang, 'orders.status'),
    placedOn: tr(lang, 'orders.placed_on'),
    estDelivery: tr(lang, 'orders.estimated_delivery'),
    items: tr(lang, 'orders.items'),
    total: tr(lang, 'orders.total'),
    pending: tr(lang, 'orders.status.pending'),
    processing: tr(lang, 'orders.status.processing'),
    shipped: tr(lang, 'orders.status.shipped'),
    delivered: tr(lang, 'orders.status.delivered'),
    cancelled: tr(lang, 'orders.status.cancelled'),
    orderPlaced: tr(lang, 'orders.step.order_placed'),
    processingStep: tr(lang, 'orders.step.processing'),
    shippedStep: tr(lang, 'orders.step.shipped'),
    deliveredStep: tr(lang, 'orders.step.delivered'),
    quantity: tr(lang, 'orders.quantity'),
    each: tr(lang, 'orders.each'),
    tracking: tr(lang, 'orders.tracking'),
    viewDetails: tr(lang, 'orders.view_details'),
    leaveReview: tr(lang, 'orders.leave_review'),
    trackOrder: tr(lang, 'orders.track_order'),
    tryAgain: tr(lang, 'actions.try_again'),
    noMore: tr(lang, 'result.no_more_results'),
    noOrders: tr(lang, 'orders.no_orders'),
  }
}

async function OrdersPage({ searchParams }: Props) {
  const lang = await Trans.getUserLang()
  const tr = await getTranslations(lang)

  return <OrdersListWrapper tr={tr} />
}

export default OrdersPage
