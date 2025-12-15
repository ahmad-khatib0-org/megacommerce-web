import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import InventoryListWrapper from '@/components/inventory/inventory-list-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'inventory.supplier.list.title'),
  }
}

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    title: tr(lang, 'inventory.supplier.list.title'),
    subtitle: tr(lang, 'inventory.supplier.list.subtitle'),
    totalItems: tr(lang, 'inventory.supplier.stats.total_items'),
    lowStock: tr(lang, 'inventory.supplier.stats.low_stock'),
    outOfStock: tr(lang, 'inventory.supplier.stats.out_of_stock'),
    search: tr(lang, 'inventory.supplier.search'),
    sku: tr(lang, 'inventory.supplier.sku'),
    product: tr(lang, 'inventory.supplier.product'),
    stock: tr(lang, 'inventory.supplier.stock'),
    available: tr(lang, 'inventory.supplier.available'),
    reserved: tr(lang, 'inventory.supplier.reserved'),
    status: tr(lang, 'inventory.supplier.status'),
    inStock: tr(lang, 'inventory.supplier.status.in_stock'),
    lowStockStatus: tr(lang, 'inventory.supplier.status.low_stock'),
    outOfStockStatus: tr(lang, 'inventory.supplier.status.out_of_stock'),
    lastUpdated: tr(lang, 'inventory.supplier.last_updated'),
    actions: tr(lang, 'inventory.supplier.actions'),
    edit: tr(lang, 'inventory.supplier.edit'),
    view: tr(lang, 'inventory.supplier.view'),
    delete: tr(lang, 'inventory.supplier.delete'),
    clearFilters: tr(lang, 'inventory.supplier.clear_filters'),
    noInventory: tr(lang, 'inventory.supplier.no_inventory'),
    noInventoryDesc: tr(lang, 'inventory.supplier.no_inventory_desc'),
    loading: tr(lang, 'inventory.supplier.loading'),
    errorLoading: tr(lang, 'inventory.supplier.error_loading'),
    tryAgain: tr(lang, 'actions.try_again'),
    noMore: tr(lang, 'result.no_more_results'),
  }
}

async function Page() {
  const lang = await Trans.getUserLang()
  const trans = getTranslations(lang)

  return <InventoryListWrapper tr={trans} />
}

export default Page
