import { Trans } from "@megacommerce/shared/server";

import Categories from "@/components/home/categories";
import HomeNavbar from "@/components/home/home-navbar";
import HomeCarousel from "@/components/home/home-carousel";
import HomeShippingFeatures from "@/components/home/home-shipping-features";
import { AppData } from "@/helpers/server";

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
  }
}

export default async function Index() {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)
  const cats = AppData.instance().categories

  return <>
    <HomeNavbar tr={tr} />
    <Categories tr={tr} categories={cats} />
    <HomeCarousel />
    <HomeShippingFeatures tr={tr} />
  </>
}
