import { Trans } from '@megacommerce/shared/server'

import Categories from '@/components/home/categories'
import HomeNavbar from '@/components/home/home-navbar'
import HomeCarousel from '@/components/home/home-carousel'
import HomeShippingFeatures from '@/components/home/home-shipping-features'
import HomeBestSellers from '@/components/home/home-best-sellers'
import HomeBigDiscount from '@/components/home/home-big-discount'
import HomeNewProducts from '@/components/home/home-new-products'
import HomeMoreToLike from '@/components/home/home-more-to-like'
import { AppData } from '@/helpers/server'

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    allCats: tr(lang, 'categories.all_categories'),
    commit: tr(lang, 'megacommerce.commitment'),
    freeShipping: tr(lang, 'shipping.free_shipping'),
    freeShippingDesc: tr(lang, 'shipping.free_shipping_desc'),
    fastDelivery: tr(lang, 'shipping.fast_delivery'),
    fastDeliveryGet: tr(lang, 'shipping.fast_delivery_get_refound'),
    fastDeliveryDesc: tr(lang, 'shipping.fast_delivery_desc'),
    freeReturn: tr(lang, 'shipping.free_return'),
    freeReturnOn: tr(lang, 'shipping.free_return_on_millions_of_items'),
    freeReturnDesc: tr(lang, 'shipping.free_return_desc'),
    bestSellers: tr(lang, 'products.best_sellers'),
    bigDisc: tr(lang, 'products.big_discount'),
    sold: tr(lang, 'products.sold'),
    hot: tr(lang, 'products.hot_and_new'),
    more: tr(lang, 'products.more_to_like'),
    tdDel: tr(lang, 'products.today_deals'),
    tryAgain: tr(lang, 'actions.try_again'),
  }
}

export default async function Index() {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)
  const cats = AppData.instance().categories

  return (
    <>
      <HomeNavbar tr={tr} />
      <Categories tr={tr} categories={cats} />
      <HomeCarousel tr={tr} />
      <HomeShippingFeatures tr={tr} />
      <h1 className='my-8 text-center font-semibold text-4xl'>{tr.tdDel}</h1>
      <div className='grid grid-cols-3 w-11/12 mx-auto mb-10 gap-x-6'>
        <HomeBestSellers tr={tr} />
        <HomeBigDiscount tr={tr} />
        <HomeNewProducts tr={tr} />
      </div>
      <h2 className='mb-8 mt-12 text-center font-semibold text-3xl'>{tr.more}</h2>
      <HomeMoreToLike tr={tr} />
    </>
  )
}
