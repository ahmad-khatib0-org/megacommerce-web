import { Trans } from "@megacommerce/shared/server"
import {
  PRODUCT_BRAND_NAME_MAX_LENGTH,
  PRODUCT_BRAND_NAME_MIN_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MIN_LENGTH,
  PRODUCT_TITLE_MAX_LENGTH,
  PRODUCT_TITLE_MIN_LENGTH,
  PRODUCT_BULLET_POINT_MIN_LENGTH,
  PRODUCT_BULLET_POINT_MAX_LENGTH,
} from "@megacommerce/shared"

import ProductCreateWrapper from "@/components/products/create/product-create-wrapper"
import { AppData } from "@/helpers/server"

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    proIden: tr(lang, 'products.identity'),
    proDesc: tr(lang, 'products.description'),
    proVar: tr(lang, 'products.variants'),
    proHasVar: tr(lang, 'products.has_variations'),
    proMedia: tr(lang, 'products.media'),
    proMediaDesc: tr(lang, 'products.media.description'),
    offer: tr(lang, 'products.offer'),
    safety: tr(lang, 'products.safety_and_compliance'),
    back: tr(lang, 'back'),
    svAndCon: tr(lang, 'save_and_continue'),
    can: tr(lang, 'cancel'),
    proTitle: tr(lang, 'products.title'),
    proType: tr(lang, 'products.type'),
    proTypeErr: tr(lang, 'products.type.required'),
    titErr: tr(lang, 'products.title.error', { Min: PRODUCT_TITLE_MIN_LENGTH, Max: PRODUCT_TITLE_MAX_LENGTH }),
    brand: tr(lang, 'products.brand_name'),
    brandErr: tr(lang, 'products.brand_name.error', { Min: PRODUCT_BRAND_NAME_MIN_LENGTH, Max: PRODUCT_BRAND_NAME_MAX_LENGTH }),
    noBrand: tr(lang, 'products.no_brand_name'),
    required: tr(lang, 'required'),
    proID: tr(lang, 'products.external_product_id'),
    noProID: tr(lang, 'products.no_external_product_id'),
    correct: tr(lang, 'form.fields.invalid'),
    descErr: tr(lang, 'products.description.error', { Min: PRODUCT_DESCRIPTION_MIN_LENGTH, Max: PRODUCT_DESCRIPTION_MAX_LENGTH }),
    bullets: tr(lang, 'products.bullet_points'),
    bullet: tr(lang, 'products.bullet_points.bullet_point'),
    bulletErr: tr(lang, 'products.bullet_points.error', { Min: PRODUCT_BULLET_POINT_MIN_LENGTH, Max: PRODUCT_BULLET_POINT_MAX_LENGTH }),
    bulletDel: tr(lang, 'products.bullet_points.delete'),
    addMore: tr(lang, 'add_more'),
  }
}

async function Page({ }) {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)
  const categories = AppData.instance().categories

  return (<ProductCreateWrapper tr={tr} categories={categories} />)
}

export default Page
