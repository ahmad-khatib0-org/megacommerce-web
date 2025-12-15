import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import InventoryUpdateWrapper from '@/components/inventory/inventory-update-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'inventory.supplier.update.title'),
  }
}

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    title: tr(lang, 'inventory.supplier.update.title'),
    subtitle: tr(lang, 'inventory.supplier.update.subtitle'),
    back: tr(lang, 'back'),
    loading: tr(lang, 'inventory.supplier.loading'),
    errorLoading: tr(lang, 'inventory.supplier.error_loading'),
    tryAgain: tr(lang, 'actions.try_again'),
    operation: tr(lang, 'inventory.supplier.update.operation'),
    operationSet: tr(lang, 'inventory.supplier.update.operation.set'),
    operationAdd: tr(lang, 'inventory.supplier.update.operation.add'),
    operationSubtract: tr(lang, 'inventory.supplier.update.operation.subtract'),
    quantity: tr(lang, 'inventory.supplier.update.quantity'),
    reason: tr(lang, 'inventory.supplier.update.reason'),
    update: tr(lang, 'update'),
    cancel: tr(lang, 'cancel'),
    updateSuccess: tr(lang, 'inventory.update.success'),
    itemNotFound: tr(lang, 'error.not_found'),
    product: tr(lang, 'inventory.supplier.product'),
    sku: tr(lang, 'inventory.supplier.sku'),
    stock: tr(lang, 'inventory.supplier.stock'),
    available: tr(lang, 'inventory.supplier.available'),
    reserved: tr(lang, 'inventory.supplier.reserved'),
    status: tr(lang, 'inventory.supplier.status'),
    inStock: tr(lang, 'inventory.supplier.status.in_stock'),
    lowStockStatus: tr(lang, 'inventory.supplier.status.low_stock'),
    outOfStockStatus: tr(lang, 'inventory.supplier.status.out_of_stock'),
  }
}

type PageProps = {
  params: Promise<{ itemId: string }>
}

async function Page({ params }: PageProps) {
  const lang = await Trans.getUserLang()
  const { itemId } = await params
  const trans = getTranslations(lang)

  return <InventoryUpdateWrapper tr={trans} itemId={itemId} />
}

export default Page
