import 'client-only'
import { Dispatch, RefObject, SetStateAction } from 'react'
import Uppy, { Meta } from '@uppy/core'
import { array, boolean as booleanSchema, number, object, string, TestContext } from 'yup'

import { AppError } from '@megacommerce/proto/web/shared/v1/error'
import { Any } from '@megacommerce/proto/web/shared/v1/types'
import {
  ProductCreateRequest,
  ProductCreateRequestDetailsWithoutVariants,
  ProductCreateRequestDetailsWithVariants,
  ProductCreateRequestMediaWithoutVariants,
  ProductCreateRequestMediaWithVariants,
  ProductCreateRequestOfferWithoutVariants,
  ProductCreateRequestOfferWithVariants,
  ProductCreateRequestSafety,
} from '@megacommerce/proto/web/products/v1/product_create'
import { ProductDataResponseData } from '@megacommerce/proto/web/products/v1/product_data'
import { NumericRuleType, StringRuleType } from '@megacommerce/proto/web/shared/v1/validation'
import { Attachment, Attachments } from '@megacommerce/proto/web/shared/v1/attachment'
import {
  SubcategoryAttribute,
  SubcategorySafety,
} from '@megacommerce/proto/web/products/v1/product_categories'

import { getFirstErroredStepV2, toAnyGrpc, tr as translator } from '@megacommerce/shared/client'
import {
  ObjString,
  ValueLabel,
  PRODUCT_TITLE_MAX_LENGTH,
  PRODUCT_TITLE_MIN_LENGTH,
  PRODUCT_BRAND_NAME_MIN_LENGTH,
  PRODUCT_BRAND_NAME_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MIN_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_BULLET_POINT_MIN_LENGTH,
  PRODUCT_BULLET_POINT_MAX_LENGTH,
  PRODUCT_SKU_MIN_LENGTH,
  PRODUCT_SKU_MAX_LENGTH,
  PRODUCT_MINIMUM_INVENTORY_QUANTITY,
  PRODUCT_OFFERING_CONDITION,
  PRODUCT_FULFILLMENT_TYPE,
  PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH,
  PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH,
  PRODUCT_VARIATION_TITLE_MIN_LENGTH,
  PRODUCT_VARIATION_TITLE_MAX_LENGTH,
  PRODUCT_ID_TYPES,
  productIDValidate,
  getProductIDType,
} from '@megacommerce/shared'

import { ProductCreateIdentityForm } from '@/components/products/create/product-create-identity'
import { ProductCreateDescriptionForm } from '@/components/products/create/product-create-description'
import { ProductCreateDetailsHandlers } from '@/components/products/create/product-create-details'
import { ProductCreateDetailsVariationsFormValues } from '@/components/products/create/product-create-details-with-variations'
import {
  ProductCreateOfferForm,
  ProductCreateOfferFormValuesPayload,
  ProductCreateOfferPriceFormValues,
} from '@/components/products/create/product-create-offer'
import { ProductCreateOfferWithoutVariationsForm } from '@/components/products/create/product-create-offer-without-variations'
import {
  ProductCreateOfferWithVariationsForm,
  ProductCreateOfferWithVariationsHandler,
} from '@/components/products/create/product-create-offer-with-variations'
import { ProductCreateCustomErrors } from '@/store'
import { ProductCreateSafetyAndCompliance } from '@/components/products/create/product-create-safety-and-compliance'

export class Products {
  constructor() { }

  static identityForm(tr: ObjString) {
    return object().shape({
      title: string()
        .min(PRODUCT_TITLE_MIN_LENGTH, tr.titErr)
        .max(PRODUCT_TITLE_MAX_LENGTH, tr.titErr)
        .required(tr.titErr),
      category: string().required(tr.proTypeErr),
      subcategory: string().required(tr.proTypeErr),
      has_variations: booleanSchema().optional(),
      brand_name: string().when('no_brand', {
        is: false,
        then: (s) =>
          s.min(PRODUCT_BRAND_NAME_MIN_LENGTH).max(PRODUCT_BRAND_NAME_MAX_LENGTH).required(tr.brandErr),
        otherwise: (s) => s.notRequired(),
      }),
      no_brand: booleanSchema().required(),
      product_id: string().when('no_product_id', {
        is: false,
        then: (s) =>
          s.required(tr.required).test('product-id-validation', tr.proIDErr, function (value) {
            const { product_id_type, no_product_id } = this.parent
            // Skip validation if no_product_id is true or fields are missing
            if (no_product_id || !product_id_type || !value) return true
            return productIDValidate(getProductIDType(product_id_type), value)
          }),
        otherwise: (s) => s.notRequired(),
      }),
      product_id_type: string().when('no_product_id', {
        is: false,
        then: (s) => s.required(tr.required).oneOf(Object.values(PRODUCT_ID_TYPES), tr.invInp),
        otherwise: (s) => s.notRequired(),
      }),
      no_product_id: booleanSchema().required(),
    })
  }

  static identityFormValues() {
    return {
      title: 'product title',
      category: '',
      subcategory: '',
      has_variations: false,
      brand_name: 'brand name',
      no_brand: false,
      product_id: '',
      product_id_type: '',
      no_product_id: true,
    }
  }

  static descriptionForm(tr: ObjString) {
    return object().shape({
      description: string()
        .min(PRODUCT_DESCRIPTION_MIN_LENGTH, tr.descErr)
        .max(PRODUCT_DESCRIPTION_MAX_LENGTH, tr.descErr)
        .required(tr.descErr),
      bullet_points: array()
        .min(1, 'at least one bullet should be provided')
        .of(
          object().shape({
            id: string().required(),
            bullet_point: string()
              .min(PRODUCT_BULLET_POINT_MIN_LENGTH, tr.bulletErr)
              .max(PRODUCT_BULLET_POINT_MAX_LENGTH, tr.bulletErr)
              .typeError(tr.bulletErr),
          })
        ),
    })
  }

  static descriptionFormValues() {
    return {
      description: 'the description........ and again again ',
      bullet_points: [{ id: Date.now().toString(), bullet_point: 'the bullet point....................' }],
    }
  }

  static detailsWithoutVariationsForm(fields: ProductDataResponseData, tr: ObjString, lang: string) {
    const data = fields.subcategory?.data
    const trans = fields.subcategory?.translations
    if (!data || !trans)
      return {
        formFields: {} as { [key: string]: any },
        initialVals: {} as Record<string, any>,
        formShape: undefined,
      }

    const { formFields, initialVals } = this.buildFormFieldsValidators(lang, tr, data.attributes)

    const formShape = object().shape(formFields)
    return { formShape, initialVals }
  }

  static detailsWithVariationsForm(fields: ProductDataResponseData, tr: ObjString, lang: string) {
    const { fieldsVariations, fieldsShared, trans } = this.buildProductDetailsFormFieldsVariations(fields)
    const { formFields: sharedFormFields, initialVals: sharedInitialValues } = this.buildFormFieldsValidators(
      lang,
      tr,
      fieldsShared
    )
    const { formFields: varFormFields, initialVals: variationsInitialVals } = this.buildFormFieldsValidators(
      lang,
      tr,
      fieldsVariations
    )

    const variationsFormFields = {
      ...varFormFields,
      id: string(),
      title: string()
        .required(tr.required)
        .min(
          PRODUCT_VARIATION_TITLE_MIN_LENGTH,
          translator(lang, 'form.fields.min', { Min: PRODUCT_VARIATION_TITLE_MIN_LENGTH })
        )
        .max(
          PRODUCT_VARIATION_TITLE_MAX_LENGTH,
          translator(lang, 'form.fields.max', { Max: PRODUCT_VARIATION_TITLE_MAX_LENGTH })
        ),
    }
    const variationsInitialValues: { variations: Record<string, any>[] } = {
      variations: [{ ...variationsInitialVals, title: '', id: Date.now().toString() }],
    }

    const sharedFormShape = object().shape(sharedFormFields)
    const variationsFormShape = object().shape({
      variations: array().of(object().shape(variationsFormFields)),
    })

    return {
      trans,
      fieldsVariations,
      fieldsShared,
      sharedFormShape,
      sharedInitialValues,
      variationsFormShape,
      variationsInitialValues,
    }
  }

  static buildProductDetailsFormFieldsVariations(productDetailsData: ProductDataResponseData) {
    const trans = productDetailsData.subcategory?.translations!
    const attrs = productDetailsData.subcategory?.data!.attributes ?? {}
    const fieldsVariations: { [key: string]: SubcategoryAttribute } = {}
    const fieldsShared: { [key: string]: SubcategoryAttribute } = {}
    for (const field of Object.entries(attrs)) {
      if (field[1].includeInVariants) fieldsVariations[field[0]] = field[1]
      else fieldsShared[field[0]] = field[1]
    }

    return { attrs, trans, fieldsVariations, fieldsShared }
  }

  static offerForm(tr: ObjString) {
    return object().shape({
      currency: string().required(tr.required),
      fulfillment_type: string()
        .oneOf(Object.values(PRODUCT_FULFILLMENT_TYPE), tr.invInp)
        .required(tr.required),
      processing_time: number().moreThan(0, tr.bgrThan0).required(tr.required),
    })
  }

  static offerFormValues() {
    return { currency: 'USD', fulfillment_type: 'megacommerce', processing_time: 3 }
  }

  static offerPriceForm(tr: ObjString) {
    return {
      sku: string()
        .min(PRODUCT_SKU_MIN_LENGTH, tr.skuErr)
        .max(PRODUCT_SKU_MAX_LENGTH, tr.skuErr)
        .required(tr.skuErr),
      quantity: number().when('fulfillment_type', {
        is: PRODUCT_FULFILLMENT_TYPE.Supplier,
        then: (s: any) => s.min(PRODUCT_MINIMUM_INVENTORY_QUANTITY, tr.quanityErr).required(tr.quanityErr),
        otherwise: (s: any) => s.notRequired(),
      }),
      price: number().typeError(tr.bgrThan0).min(0, tr.bgrThan0).required(tr.required),
      offering_condition: string()
        .oneOf(Object.values(PRODUCT_OFFERING_CONDITION), tr.invInp)
        .required(tr.required),
      // condition_note stays nullable string
      condition_note: string()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .when('offering_condition', {
          is: PRODUCT_OFFERING_CONDITION.Used,
          then: (s: any) =>
            s
              .min(PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH, tr.condNoteErr)
              .max(PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH, tr.condNoteErr)
              .nullable(),
          otherwise: (s: any) => s.nullable(),
        }),

      list_price: number()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .typeError(tr.bgrThan0)
        .moreThan(0, tr.bgrThan0)
        .test('list-gte-your', tr.lsPriceErr, function (value) {
          if (value == null) return true
          const price = this.parent?.price
          if (price == null || price === '') return true

          const vNum = Number(value),
            pNum = Number(price)
          if (Number.isNaN(vNum) || Number.isNaN(pNum)) return false
          return vNum >= pNum
        }),

      has_sale_price: booleanSchema(),
      sale_price: number()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .typeError(tr.bgrThan0)
        .moreThan(0, tr.bgrThan0)
        .test('required-if-dates', tr.required, function (value) {
          const { sale_price_start, sale_price_end } = this.parent
          if (
            (sale_price_start || sale_price_end) &&
            (value === null || value === undefined || value.toString() === '')
          ) {
            return false
          }
          return true
        }),

      // important: use string().nullable() for dates to match interface (ISO strings)
      sale_price_start: string()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .when('sale_price', {
          is: (v: number | string | null) => v != null && v !== '',
          then: (s: any) => s.required(tr.saleSErr),
        }),

      sale_price_end: string()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .when('sale_price', {
          is: (v: number | string | null) => v != null && v !== '',
          then: (s: any) =>
            s.required(tr.saleEErr).test(
              'end-after-start',
              tr.saleLsErr,
              // typed 'this' and typed 'end' param to satisfy TS
              function (this: TestContext, end: string | null | undefined) {
                const start = this.parent?.sale_price_start as string | null | undefined
                if (!end || !start) return true
                return new Date(end) > new Date(start)
              }
            ),
        }),

      has_minimum_orders: booleanSchema(),
      minimum_orders: array()
        .of(
          object().shape({
            id: string().required(),
            price: number().typeError(tr.invNum).moreThan(0, tr.bgrThan0).required(tr.required),
            quantity: number().typeError(tr.invNum).moreThan(0, tr.bgrThan0).required(tr.required),
          })
        )
        .nullable(),
    }
  }

  static offerPriceFormValues() {
    return {
      sku: 'Product sku',
      quantity: 44,
      price: 33,
      offering_condition: 'new',
      condition_note: '',
      list_price: null,
      has_sale_price: false,
      sale_price: null,
      sale_price_start: null,
      sale_price_end: null,
      has_minimum_orders: false,
      minimum_orders: null,
    }
  }

  static offerPriceVariationsForm(tr: ObjString) {
    return object().shape({
      variations: array().of(
        object().shape({
          ...this.offerPriceForm(tr),
          id: string().required(tr.required),
          title: string().notRequired(),
        })
      ),
    })
  }

  static offerPriceVariationsFormValues(titles: ValueLabel[]) {
    const values = this.offerPriceFormValues()
    const variations = []
    for (const title of titles) variations.push({ id: title.value, title: title.label, ...values })
    return { variations }
  }

  static safetyForm(fields: ProductDataResponseData, tr: ObjString, lang: string) {
    const data = fields.subcategory?.data?.safety
    if (!data)
      return {
        formFields: {} as { [key: string]: any },
        initialVals: {} as Record<string, any>,
        formShape: undefined,
      }

    const { formFields, initialVals } = this.buildFormFieldsValidators(lang, tr, data)

    formFields['attestation'] = booleanSchema().oneOf([true], tr.mustChecked)
    initialVals['attestation'] = false

    const formShape = object().shape(formFields)
    return { formShape, initialVals }
  }

  private static buildFormFieldsValidators(
    lang: string,
    tr: ObjString,
    attrs: { [key: string]: SubcategoryAttribute | SubcategorySafety }
  ) {
    const formFields: { [key: string]: any } = {}
    const initialVals: Record<string, any> = {}

    for (const [fieldName, fieldData] of Object.entries(attrs)) {
      if (fieldData.type === 'input') {
        initialVals[fieldName] = ''
        const str = fieldData.validation?.str
        const num = fieldData.validation?.numeric
        const required = fieldData.required

        if (str) {
          let schema = required ? string().required(tr.required) : string()
          for (const rule of str.rules) {
            if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min_length', { Min: rule.value }))
            } else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max_length', { Max: rule.value }))
            }
          }
          formFields[fieldName] = schema
        } else if (num) {
          let schema = required
            ? number().required(tr.required).typeError(tr.invNum)
            : number().typeError(tr.invNum)
          for (const rule of num.rules) {
            if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min', { Min: rule.value }))
            } else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max', { Max: rule.value }))
            } else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_GT) {
              schema = schema.moreThan(
                rule.value,
                translator(lang, 'form.fields.greater_than', { Max: rule.value })
              )
            } else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_LT) {
              schema = schema.lessThan(
                rule.value,
                translator(lang, 'form.fields.less_than', { Min: rule.value })
              )
            }
          }
          formFields[fieldName] = schema
        }
      } else if (fieldData.type === 'select') {
        initialVals[fieldName] = ''
        let schema = fieldData.required ? string().required(tr.required) : string()
        schema = schema.oneOf(fieldData.stringArray, tr.invInp)
        formFields[fieldName] = schema
      } else if (fieldData.type === 'boolean') {
        initialVals[fieldName] = false
        formFields[fieldName] = booleanSchema()
      }
    }

    return { formFields, initialVals }
  }

  static getMediaSizeInBytes(
    media:
      | { images: Attachment[]; videos: Attachment[] }
      | {
        images: Record<string, { title: string; images: Attachment[] }>
        videos: Record<string, Attachment[]>
      }
  ) {
    let totalSize = 0
    if (isWithVariantsMedia(media)) {
      for (const [_, value] of Object.entries(media.images)) {
        totalSize += value
          .map((image) => parseInt(image.fileSize))
          .reduce((total, current, _) => total + current, 0)
      }
    } else if (isWithoutVariantsMedia(media)) {
      for (const [_, value] of Object.entries(media.images)) totalSize += parseInt(value.fileSize)
    }
    return totalSize
  }

  static buildRequest(
    identity: ProductCreateIdentityForm,
    desc: ProductCreateDescriptionForm,
    details: { variants: ProductCreateDetailsVariationsFormValues; noVariants: Record<string, any> },
    media:
      | { images: Attachment[]; videos: Attachment[] }
      | {
        images: {
          [key: string]: { title: string; images: Attachment[] }
        }
        videos: Record<string, Attachment[]>
      },
    offer: ProductCreateOfferFormValuesPayload,
    safety: Record<string, any>
  ): ProductCreateRequest {
    const hasVariants = identity.values.has_variations
    const detailsVariants: ProductCreateRequestDetailsWithVariants = { variants: [] }
    const detailsWithouVariants: ProductCreateRequestDetailsWithoutVariants = { form: {} }
    const mediaVariants: ProductCreateRequestMediaWithVariants = { images: {}, videos: {} }
    const mediaWithouVariants: ProductCreateRequestMediaWithoutVariants = { videos: [], images: [] }
    const offerVariants: ProductCreateRequestOfferWithVariants = { variants: [] }
    let offerWithouVariants: ProductCreateRequestOfferWithoutVariants

    const toAny = (form: Record<string, any>): Record<string, Any> => {
      const result: Record<string, Any> = {}
      for (const [key, value] of Object.entries(form)) result[key] = toAnyGrpc(value)
      return result
    }

    if (hasVariants) {
      detailsVariants.variants = details.variants.variations.map((variant) => ({ form: toAny(variant) }))
    } else {
      detailsWithouVariants.form = toAny(details.noVariants)
    }

    const mediaTotalSize = this.getMediaSizeInBytes(media)
    if (isWithVariantsMedia(media)) {
      const images: { [key: string]: Attachments } = {}
      const videos: { [key: string]: Attachments } = {}
      for (const img of Object.entries(media.images)) images[img[0]] = { attachments: img[1] }
      for (const vid of Object.entries(media.videos)) videos[vid[0]] = { attachments: vid[1] }
      mediaVariants.images = images
      mediaVariants.videos = videos
    } else if (isWithoutVariantsMedia(media)) {
      mediaWithouVariants.images = media.images
      mediaWithouVariants.videos = media.videos
    }

    const buildOfferForm = (v: ProductCreateOfferPriceFormValues) => {
      return {
        sku: v.sku,
        quantity: v.quantity.toFixed(0).toString(),
        price: v.price.toString(),
        offeringCondition: v.offering_condition,
        conditionNote: v.condition_note ?? undefined,
        listPrice: v.list_price ? v.list_price.toString() : undefined,
        hasSalePrice: v.has_sale_price,
        salePrice: v.sale_price ? v.sale_price.toString() : undefined,
        salePriceStart: v.sale_price_start ?? undefined,
        salePriceEnd: v.sale_price_end ?? undefined,
        hasMinimumOrders: v.has_minimum_orders,
        minimumOrders: (v.minimum_orders ?? []).map((mo) => ({
          id: mo.id,
          quantity: mo.quantity.toString(),
          price: mo.price.toString(),
        })),
      }
    }

    if (hasVariants) {
      offerVariants.variants =
        offer.withVariant?.variations.map((v) => ({ id: v.id, ...buildOfferForm(v) })) ?? []
    } else {
      offerWithouVariants = buildOfferForm(offer.withoutVariant!)
    }

    const buildSafetyForm = (values: Record<string, any>): ProductCreateRequestSafety => {
      let attestation = false
      if ('attestation' in values && typeof values.attestation === 'boolean') {
        attestation = values.attestation
        delete values.attestation
      }
      return { attestation, form: toAny(values) }
    }

    return {
      identity: {
        title: identity.values.title,
        category: identity.values.category,
        subcategory: identity.values.subcategory,
        hasVariations: identity.values.has_variations,
        brandName: identity.values.brand_name,
        noBrand: identity.values.no_brand,
        productId: identity.values.product_id,
        productIdType: identity.values.product_id_type,
        noProductId: identity.values.no_product_id,
      },
      description: {
        description: desc.values.description,
        bulletPoints: desc.values.bullet_points.map((bp) => ({ id: bp.id, bulletPoint: bp.bullet_point })),
      },
      details: {
        shared: hasVariants ? toAny(details.noVariants) : {},
        withVariants: hasVariants ? detailsVariants : undefined,
        withoutVariants: !hasVariants ? detailsWithouVariants : undefined,
      },
      media: {
        withVariants: hasVariants ? mediaVariants : undefined,
        withoutVariants: !hasVariants ? mediaWithouVariants : undefined,
        totalSize: mediaTotalSize.toString(),
      },
      offer: {
        withVariants: hasVariants ? offerVariants : undefined,
        withoutVariants: !hasVariants ? offerWithouVariants! : undefined,
        currency: offer.base!.currency,
        fulfillmentType: offer.base!.fulfillment_type,
        processingTime: offer.base!.processing_time.toString(),
      },
      safety: buildSafetyForm(safety),
    }
  }

  static getStepsIndexAndNames(): Map<string, { stepNumber: number }> {
    return new Map([
      ['identity', { stepNumber: 0 }],
      ['description', { stepNumber: 1 }],
      ['details', { stepNumber: 2 }],
      ['media', { stepNumber: 3 }],
      ['offer', { stepNumber: 4 }],
      ['safety', { stepNumber: 5 }],
    ])
  }

  // 'description.bullet_points.count'
  // '{step_name}.form.missing'
  // '{step_name}.form_id.missing'
  // media.count  => missing product images
  // media.{form_id}.count =>  images count error
  // media.{form_id}.{attachment_id}
  // offer.[{form_id}].minimum_orders.count
  // offer.[{form_id}].minimum_orders.form_id.missing
  // offer.[{form_id}].minimum_orders.{id}.{quantity/price}

  // TODO: for the getInitialValues and similar functions that depends on the present
  // of the RefObjec.current, consider passing the stored values in the global store
  // in case if these functions (getInitialValues or ...) returns Record<string, any>
  // of length zero, which i think can happen, because of the mounting and unmounting of step
  static handleCreateError(
    error: AppError,
    setStep: Dispatch<SetStateAction<number>>,
    setProductCustomErrors: (errors: Partial<ProductCreateCustomErrors | null>) => void,
    identity: ProductCreateIdentityForm,
    description: ProductCreateDescriptionForm,
    media: {
      uppy: Uppy<Meta, Record<string, never>>
      variantsImages: { [key: string]: { title: string; images: Attachment[] } }
      setVariantsImages: Dispatch<SetStateAction<{ [key: string]: { title: string; images: Attachment[] } }>>
    },
    offer: {
      base: ProductCreateOfferForm
      noVariants: ProductCreateOfferWithoutVariationsForm
      variants: RefObject<ProductCreateOfferWithVariationsHandler | null>
    }
  ) {
    if (error.errors) {
      const customErrors: Partial<ProductCreateCustomErrors> = {}
      const hasVariations = identity.values.has_variations
      let variantImagesShouldUpdate = false
      let variantImages = { ...media.variantsImages }
      const detailsVariantsErrors: { [key: string]: Record<string, any> } = {}
      const detailsVariantsSharedErrors: Record<string, any> = {}
      const detailsNoVariantsErrors: Record<string, any> = {}
      const offerVariantsErrors: { [key: string]: Record<string, any> } = {}
      const offerNoVariantsErrors: Record<string, any> = {}
      const safetyErrors: Record<string, any> = {}

      for (const [field, err] of Object.entries(error.errors.values)) {
        if (field.startsWith('identity')) {
          this.invalidateIdentity(identity, field, err, customErrors)
        } else if (field.startsWith('description')) {
          this.invalidateDescription(description, field, err, customErrors)
        } else if (field.startsWith('details')) {
          this.invalidateDetails(
            field,
            err,
            customErrors,
            hasVariations,
            detailsNoVariantsErrors,
            detailsVariantsErrors,
            detailsVariantsSharedErrors
          )
        } else if (field.startsWith('media')) {
          const updatedVariantImages = this.invalidateMedia(
            media.uppy,
            variantImages,
            field,
            err,
            customErrors,
            hasVariations,
            () => (variantImagesShouldUpdate = true)
          )
          if (updatedVariantImages) {
            variantImages = updatedVariantImages
          }
        } else if (field.startsWith('offer')) {
          this.invalidateOffer(
            offer,
            field,
            err,
            customErrors,
            hasVariations,
            offerNoVariantsErrors,
            offerVariantsErrors
          )
        } else if (field.startsWith('safety')) {
          this.invalidateSafety(field, err, customErrors, safetyErrors)
        }
      }

      if (variantImagesShouldUpdate) {
        media.setVariantsImages(variantImages)
      }
      setProductCustomErrors(customErrors)
      let stepNumber = getFirstErroredStepV2(error.errors, this.getStepsIndexAndNames())
      if (stepNumber != -1) setStep(stepNumber)
    }
  }

  private static invalidateIdentity(
    form: ProductCreateIdentityForm,
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>
  ) {
    if (field === 'identity.title') form.setFieldError('title', err)
    else if (field === 'identity.category' || field === 'identity.subcategory') {
      custom.identity = { ...custom.identity, product_type: err }
    } else if (field === 'identity.brand') form.setFieldError('brand_name', err)
    else if (field === 'identity.product_id') form.setFieldError('product_id', err)
    else if (field === 'identity.product_id_type') form.setFieldError('product_id_type', err)
    else if (field === 'identity.form.missing') {
      custom.identity = { ...custom.identity, missing_form: err }
    }
  }

  private static invalidateDescription(
    form: ProductCreateDescriptionForm,
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>
  ) {
    if (field === 'description.description') form.setFieldError('title', err)
    else if (field === 'description.bullet_points.count') {
      custom.description = { ...custom.description, bullet_points_count: err }
    } else if (field === 'identity.form.missing') {
      custom.description = { ...custom.description, missing_form: err }
    } else {
      for (const bp of form.values.bullet_points) {
        if (field === `description.bullet_points.${bp.id}.bullet_point`) {
          form.setFieldError(`bullet_points.${bp}.bullet_point`, err)
        }
      }
    }
  }

  private static invalidateDetails(
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>,
    hasVariations: boolean,
    noVariantsErrors: Record<string, any>,
    variantsErrors: { [key: string]: Record<string, any> },
    variantsSharedErrors: Record<string, any>
  ) {
    if (field === 'details.form.missing') {
      custom.details = { ...custom.details, missing_form: err }
      return
    }

    const split = field.split('.')
    if (hasVariations) {
      if (field === 'details.form_id.missing') {
        custom.details = { ...custom.details, missing_form_id: err }
        return
      }
      if (split.length === 3 /*details.{form_id}.{field_name}*/) {
        variantsErrors[split[1]] = { ...(variantsErrors[split[1]] || {}), [split[2]]: err }
      } else if (split.length === 2 /*details.{field_name}*/) {
        variantsSharedErrors[split[1]] = err
      }
    } else if (split.length === 2 /*details.{field_name}*/) {
      noVariantsErrors[split[1]] = err
    }
  }

  static invalidateMedia(
    uppy: Uppy<Meta, Record<string, never>>,
    variantsImages: { [key: string]: { title: string; images: Attachment[] } },
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>,
    hasVariants: boolean,
    variantImagesShouldUpdate: () => void
  ): { [key: string]: { title: string; images: Attachment[] } } | null {
    if (field === 'media.form.missing') {
      custom.media = { ...custom.media, missing_form: err }
      return null
    } else if (field === 'media.form_id.missing') {
      custom.media = { ...custom.media, missing_form_id: err }
      return null
    } else if (field === 'media.count') {
      custom.media = { ...custom.media, missing_form: err }
      return null
    }

    const split = field.split('.')
    if (hasVariants && split.length === 3) {
      const variantId = split[1]
      const imageId = split[2]

      const variant = variantsImages[variantId]
      if (!variant) return null

      const imageIndex = variant.images.findIndex((img) => img.id === imageId)
      if (imageIndex === -1) return null

      const updatedVariantsImages = {
        ...variantsImages,
        [variantId]: {
          ...variant,
          images: [
            ...variant.images.slice(0, imageIndex),
            { ...variant.images[imageIndex], error: err },
            ...variant.images.slice(imageIndex + 1),
          ],
        },
      }

      variantImagesShouldUpdate()
      return updatedVariantsImages
    } else if (split.length === 2) {
      if (uppy.getFile(split[1])) {
        uppy.setFileState(split[1], { error: err })
      }
    }

    return null
  }

  static invalidateOffer(
    step: {
      base: ProductCreateOfferForm
      noVariants: ProductCreateOfferWithoutVariationsForm
      variants: RefObject<ProductCreateOfferWithVariationsHandler | null>
    },
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>,
    hasVariations: boolean,
    noVariantsErrors: Record<string, any>,
    variantsErrors: { [key: string]: Record<string, any> }
  ) {
    if (field === 'offer.form.missing') {
      custom.offer = { ...custom.offer, missing_form: err }
      return
    } else if (field === 'offer.form_id.missing') {
      custom.offer = { ...custom.offer, missing_form_id: err }
      return
    } else if (field === 'offer.currency') {
      step.base.setFieldError('currency', err)
      return
    } else if (field === 'offer.fulfillment_type') {
      step.base.setFieldError('fulfillment_type', err)
      return
    } else if (field === 'offer.processing_time') {
      step.base.setFieldError('processing_time', err)
      return
    }

    const split = field.split('.')
    const variants = step.variants.current?.getForm
    if (hasVariations && variants && split.length === 3) {
      /*offer.{form_id}.{field_name}*/
      variantsErrors[split[1]] = { ...(variantsErrors[split[1]] || {}), [split[2]]: err }
    } else if (hasVariations && variants && field.includes('minimum_orders')) {
      /*offer.{form_id}.minimum_orders.count*/
      if (field.includes('minimum_orders.count') && split.length === 4) {
        custom.offer = {
          ...custom.offer,
          variants: {
            ...custom.offer?.variants,
            [split[1]]: { ...custom.offer?.variants?.[split[1]], count: err },
          },
        }
        /*offer.{form_id}.minimum_orders.form_id.missing*/
      } else if (field.includes('minimum_orders.form_id.missing') && split.length === 5) {
        /*offer.{form_id}.minimum_orders.form_id.missing*/
        custom.offer = {
          ...custom.offer,
          variants: {
            ...custom.offer?.variants,
            [split[1]]: { ...custom.offer?.variants?.[split[1]], missing_form_id: err },
          },
        }
        /*offer.{form_id}.minimum_orders.{min_order_id}.quantity*/
      } else if (field.includes('quantity') && split.length === 5) {
        variantsErrors[split[1]] = {
          ...(variantsErrors[split[1]] || {}),
          minimum_orders: {
            ...(variantsErrors[split[1]]['minimum_orders'] || {}),
            [split[3]]: {
              ...(variantsErrors[split[1]]['minimum_orders'][split[3]] || {}),
              quantity: err,
            },
          },
        }
        /*offer.{form_id}.minimum_orders.{min_order_id}.price*/
      } else if (field.includes('price') && split.length === 5) {
        variantsErrors[split[1]] = {
          ...(variantsErrors[split[1]] || {}),
          minimum_orders: {
            ...(variantsErrors[split[1]]['minimum_orders'] || {}),
            [split[3]]: {
              ...(variantsErrors[split[1]]['minimum_orders'][split[3]] || {}),
              price: err,
            },
          },
        }
      }
    } else if (!hasVariations && field.includes('minimum_orders')) {
      if (field === 'offer.minimum_orders.form_id.missing') {
        custom.offer = {
          ...custom.offer,
          no_variants: { ...custom.offer?.no_variants, missing_form_id: err },
        }
      } else if (field === 'offer.minimum_orders.count') {
        custom.offer = {
          ...custom.offer,
          no_variants: { ...custom.offer?.no_variants, count: err },
        }
        /*offer.minimum_orders.{min_order_id}.quantity*/
      } else if (field.includes('quantity') && split.length === 4) {
        noVariantsErrors['minimum_orders'] = {
          ...(noVariantsErrors['minimum_orders'] || {}),
          [split[2]]: {
            ...(noVariantsErrors['minimum_orders'][split[2]] || {}),
            quantity: err,
          },
        }
        /*offer.minimum_orders.{min_order_id}.price*/
      } else if (field.includes('price') && split.length === 4) {
        noVariantsErrors['minimum_orders'] = {
          ...(noVariantsErrors['minimum_orders'] || {}),
          [split[2]]: {
            ...(noVariantsErrors['minimum_orders'][split[2]] || {}),
            price: err,
          },
        }
      }
      /*offer.{field_name}*/
    } else if (split.length === 2) {
      noVariantsErrors[split[1]] = err
    }
  }

  static invalidateSafety(
    field: string,
    err: string,
    custom: Partial<ProductCreateCustomErrors>,
    errors: Record<string, any>
  ) {
    if (field === 'safety.form.missing') {
      custom.safety = { ...custom.safety, missing_form: err }
      return
    }

    const split = field.split('.')
    if (split.length === 2) errors[split[1]] = err
  }
}

function isWithoutVariantsMedia(media: any): media is { images: Attachment[]; videos: Attachment[] } {
  return Array.isArray(media.images) && Array.isArray(media.videos)
}

function isWithVariantsMedia(
  media: any
): media is { images: Record<string, Attachment[]>; videos: Record<string, Attachment[]> } {
  return (
    media.images instanceof Object &&
    !Array.isArray(media.images) &&
    media.videos instanceof Object &&
    !Array.isArray(media.videos)
  )
}
