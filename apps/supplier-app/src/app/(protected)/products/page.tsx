import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import ProductsListWrapper from '@/components/products/list/products-list-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'products.list.page_title'),
  }
}

const getTranslations = (lang: string) => {
  return {}
}

async function Page() {
  const lang = await Trans.getUserLang()
  const trans = getTranslations(lang)

  return <ProductsListWrapper tr={trans} />
}

export default Page
