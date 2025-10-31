import '@mantine/dates/styles.css'
import { Trans } from '@megacommerce/shared/server'
import {
  ValueLabel,
  PRODUCT_BRAND_NAME_MAX_LENGTH,
  PRODUCT_BRAND_NAME_MIN_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MIN_LENGTH,
  PRODUCT_TITLE_MAX_LENGTH,
  PRODUCT_TITLE_MIN_LENGTH,
  PRODUCT_BULLET_POINT_MIN_LENGTH,
  PRODUCT_BULLET_POINT_MAX_LENGTH,
  PRODUCT_SKU_MIN_LENGTH,
  PRODUCT_SKU_MAX_LENGTH,
  PRODUCT_MINIMUM_INVENTORY_QUANTITY,
  PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH,
  PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH,
  PRODUCT_OFFERING_CONDITION,
  PRODUCT_FULFILLMENT_TYPE,
  PRODUCT_MINIMUM_ORDER_MAX_OPTIONS,
  PRODUCTS_MAX_IMAGES_COUNT,
} from '@megacommerce/shared'

import ProductCreateWrapper from '@/components/products/create/product-create-wrapper'
import { AppData } from '@/helpers/server'

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    proIden: tr(lang, 'products.identity'),
    proDesc: tr(lang, 'products.description'),
    proVar: tr(lang, 'products.variants'),
    proDet: tr(lang, 'products.details'),
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
    titErr: tr(lang, 'products.title.error', {
      Min: PRODUCT_TITLE_MIN_LENGTH,
      Max: PRODUCT_TITLE_MAX_LENGTH,
    }),
    brand: tr(lang, 'products.brand_name'),
    brandErr: tr(lang, 'products.brand_name.error', {
      Min: PRODUCT_BRAND_NAME_MIN_LENGTH,
      Max: PRODUCT_BRAND_NAME_MAX_LENGTH,
    }),
    noBrand: tr(lang, 'products.no_brand_name'),
    required: tr(lang, 'required'),
    proID: tr(lang, 'products.external_product_id'),
    noProID: tr(lang, 'products.no_external_product_id'),
    proIDErr: tr(lang, 'products.external_product_id.invalid'),
    proIDType: tr(lang, 'products.external_product_id_type'),
    correct: tr(lang, 'form.fields.invalid'),
    descErr: tr(lang, 'products.description.error', {
      Min: PRODUCT_DESCRIPTION_MIN_LENGTH,
      Max: PRODUCT_DESCRIPTION_MAX_LENGTH,
    }),
    bullets: tr(lang, 'products.bullet_points'),
    bullet: tr(lang, 'products.bullet_points.bullet_point'),
    bulletErr: tr(lang, 'products.bullet_points.error', {
      Min: PRODUCT_BULLET_POINT_MIN_LENGTH,
      Max: PRODUCT_BULLET_POINT_MAX_LENGTH,
    }),
    bulletDel: tr(lang, 'products.bullet_points.delete'),
    addMore: tr(lang, 'add_more'),
    sku: tr(lang, 'products.sku'),
    skuErr: tr(lang, 'products.sku.error', { Min: PRODUCT_SKU_MIN_LENGTH, Max: PRODUCT_SKU_MAX_LENGTH }),
    quantity: tr(lang, 'products.quantity'),
    procTime: tr(lang, 'products.processing_time'),
    quanityErr: tr(lang, 'products.quantity.min.error', { Min: PRODUCT_MINIMUM_INVENTORY_QUANTITY }),
    pos: tr(lang, 'form.fields.positive'),
    invInp: tr(lang, 'form.field.invalid_input'),
    invNum: tr(lang, 'form.fields.invalid_number'),
    condNoteErr: tr(lang, 'products.condition_note.error', {
      Min: PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH,
      Max: PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH,
    }),
    note: tr(lang, 'products.condition_note'),
    offCond: tr(lang, 'products.offering_condition'),
    condNew: tr(lang, 'products.offering_condition.new'),
    condUsed: tr(lang, 'products.offering_condition.used'),
    bgrThan0: tr(lang, 'form.fields.bigger_than_zero'),
    lsPriceErr: tr(lang, 'products.list_price.error'),
    lsPrice: tr(lang, 'products.list_price'),
    salePrice: tr(lang, 'products.sale_price'),
    salePrcAdd: tr(lang, 'products.sale_price.add'),
    saleStart: tr(lang, 'products.sale_price_start'),
    saleEnd: tr(lang, 'products.sale_price_end'),
    saleSErr: tr(lang, 'products.sale_price_start.required'),
    saleEErr: tr(lang, 'products.sale_price_end.required'),
    saleLsErr: tr(lang, 'products.sale_price_end.lesser'),
    filType: tr(lang, 'products.fulfillment_type'),
    filMega: tr(lang, 'products.fulfillment_type.megacommerce'),
    filSup: tr(lang, 'products.fulfillment_type.supplier'),
    price: tr(lang, 'products.your_price'),
    currency: tr(lang, 'products.currency'),
    minOrd: tr(lang, 'products.minimum_order_options'),
    minOrdWarn: tr(lang, 'products.minimum_order_options.diselect.warn'),
    minOrdMax: tr(lang, 'products.minimum_order_options.max.error', {
      Min: PRODUCT_MINIMUM_ORDER_MAX_OPTIONS,
    }),
    cancel: tr(lang, 'cancel'),
    confirm: tr(lang, 'confirm'),
    itemPrice: tr(lang, 'products.per_item_price'),
    minCount: tr(lang, 'products.minimum_order_count'),
    delItem: tr(lang, 'actions.delete_item'),
    variations: tr(lang, 'products.variations'),
    shVarDesc: tr(lang, 'products.variations.shared.desc'),
    varTitle: tr(lang, 'products.variations.title'),
    varDesc: tr(lang, 'products.variations.title.desc'),
    addVar: tr(lang, 'products.variations.add'),
    rmVar: tr(lang, 'products.variations.remove'),
    varRmWarn: tr(lang, 'products.variations.remove.warn'),
    imgRelVar: tr(lang, 'products.variations.images.related'),
    varImages: tr(lang, 'products.variations.images'),
    assign: tr(lang, 'products.media.assign_images'),
    assignInfo: tr(lang, 'products.media.assign_images.info'),
    assignErr: tr(lang, 'products.media.assign_images.unselected'),
    maxForVar: tr(lang, 'products.media.variant_images.exceeded', { Max: PRODUCTS_MAX_IMAGES_COUNT }),
    noImagesToAssign: tr(lang, 'products.media.assign_images.no_images'),
    imgNotFound: tr(lang, 'products.media.variant_images.not_found'),
    rmImgVar: tr(lang, 'products.media.variant_images.remove'),
    proImgVar: tr(lang, 'products.media.variant_images.not_provided'),
    sel1Optoin: tr(lang, 'form.field.select.at_least_one'),
    notAppOr: tr(lang, 'form.field.select.not_applicable_or_rest'),
    mustChecked: tr(lang, 'form.field.checkbox.checked.error'),
    attestation: tr(lang, 'products.safety_and_compliance.attestation'),
  }
}

async function Page({ }) {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)

  const categories = AppData.instance().categories
  const offeringCondition: ValueLabel[] = [
    { value: PRODUCT_OFFERING_CONDITION.New, label: tr.condNew },
    { value: PRODUCT_OFFERING_CONDITION.Used, label: tr.condUsed },
  ]

  const filfillment: ValueLabel[] = [
    { label: tr.filMega, value: PRODUCT_FULFILLMENT_TYPE.Megacommerce },
    { label: tr.filSup, value: PRODUCT_FULFILLMENT_TYPE.Supplier },
  ]

  return (
    <ProductCreateWrapper
      tr={tr}
      categories={categories}
      offering={offeringCondition}
      filfillment={filfillment}
    />
  )
}

export default Page
