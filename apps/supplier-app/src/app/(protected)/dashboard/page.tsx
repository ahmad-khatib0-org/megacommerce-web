import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import SupplierDashboardWrapper from '@/components/dashboard/supplier-dashboard-wrapper'
import { ObjString } from '@megacommerce/shared'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'dashboard.supplier.title'),
  }
}

const getTranslations = (lang: string): ObjString => {
  const tr = Trans.tr
  return {
    title: tr(lang, 'dashboard.supplier.title'),
    totalProducts: tr(lang, 'dashboard.supplier.stats.total_products'),
    totalInventory: tr(lang, 'dashboard.supplier.stats.total_inventory'),
    totalReviews: tr(lang, 'dashboard.supplier.stats.total_reviews'),
    pendingOrders: tr(lang, 'dashboard.supplier.stats.pending_orders'),
    totalOrders: tr(lang, 'dashboard.supplier.stats.total_orders'),
    visitsByPeriod: tr(lang, 'dashboard.supplier.charts.visits_by_period'),
    productVisits: tr(lang, 'dashboard.supplier.charts.product_visits'),
    today: tr(lang, 'dashboard.supplier.periods.today'),
    yesterday: tr(lang, 'dashboard.supplier.periods.yesterday'),
    lastWeek: tr(lang, 'dashboard.supplier.periods.last_week'),
    lastMonth: tr(lang, 'dashboard.supplier.periods.last_month'),
    lastYear: tr(lang, 'dashboard.supplier.periods.last_year'),
    loading: tr(lang, 'dashboard.supplier.loading'),
    errorLoading: tr(lang, 'dashboard.supplier.error_loading'),
    tryAgain: tr(lang, 'actions.try_again'),
    comingSoon: tr(lang, 'dashboard.supplier.coming_soon'),
  }
}

async function Page() {
  const lang = await Trans.getUserLang()
  const trans = getTranslations(lang)

  return <SupplierDashboardWrapper tr={trans} />
}

export default Page
