import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import ProductsListWrapper from '@/components/products/list/products-list-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'products.supplier.list.title'),
  }
}

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    title: tr(lang, 'products.supplier.list.title'),
    subtitle: tr(lang, 'products.supplier.list.subtitle'),
    createProduct: tr(lang, 'products.supplier.create'),
    noProducts: tr(lang, 'products.supplier.no_products'),
    noProductsDesc: tr(lang, 'products.supplier.no_products_desc'),
    edit: tr(lang, 'products.supplier.edit'),
    delete: tr(lang, 'products.supplier.delete'),
    status: tr(lang, 'products.supplier.status'),
    created: tr(lang, 'products.supplier.created'),
    price: tr(lang, 'products.supplier.price'),
    quantity: tr(lang, 'products.supplier.quantity'),
    loading: tr(lang, 'products.supplier.loading'),
    errorLoading: tr(lang, 'products.supplier.error_loading'),
    tryAgain: tr(lang, 'actions.try_again'),
    noMore: tr(lang, 'result.no_more_results'),
  }
}

async function Page() {
  const lang = await Trans.getUserLang()
  const trans = getTranslations(lang)

  return <ProductsListWrapper tr={trans} />
}

export default Page
