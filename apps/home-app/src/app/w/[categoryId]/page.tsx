import ProductsCategoryWrapper from '@/components/category/products-category-wrapper'
import { Trans } from '@megacommerce/shared/server'

import { AppData } from '@/helpers/server'

type PageParams = {
  categoryId: string
}

type Props = {
  params: Promise<PageParams>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getTranslations(lang: string) {
  const tr = Trans.tr
  return {
    selectAll: tr(lang, 'filter.select_all'),
    sortBy: tr(lang, 'filter.sort_by'),
    newest: tr(lang, 'filter.created_at_desc'),
    oldest: tr(lang, 'filter.created_at_asc'),
    lowToHigh: tr(lang, 'filter.price_low_to_high'),
    highToLow: tr(lang, 'filter.price_high_to_low'),
    tryAgain: tr(lang, 'actions.try_again'),
    noMore: tr(lang, 'result.no_more_results'),
    sold: tr(lang, 'products.sold'),
    noProductsFound: tr(lang, 'products.no_products_found'),
  }
}

async function CategoryPage({ params, searchParams }: Props) {
  const { categoryId } = await params
  const categories = AppData.instance().categories
  const lang = await Trans.getUserLang()
  const tr = await getTranslations(lang)

  return <ProductsCategoryWrapper categoryId={categoryId} categoriesData={categories} tr={tr} />
}

export default CategoryPage
