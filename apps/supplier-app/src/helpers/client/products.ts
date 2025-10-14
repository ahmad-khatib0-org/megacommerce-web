import 'client-only'
import { array, boolean, number, object, string, TestContext } from "yup";
import {
  ObjString,
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
} from '@megacommerce/shared';

export class Products {
  constructor() { }

  static identityForm(tr: ObjString) {
    return object().shape({
      title: string().min(PRODUCT_TITLE_MIN_LENGTH, tr.titErr).max(PRODUCT_TITLE_MAX_LENGTH, tr.titErr).required(tr.titErr),
      category: string().required(tr.proTypeErr),
      has_variations: boolean().optional(),
      brand_name: string().when('no_brand', {
        is: false,
        then: (s) => s.min(PRODUCT_BRAND_NAME_MIN_LENGTH).max(PRODUCT_BRAND_NAME_MAX_LENGTH).required(tr.brandErr),
        otherwise: (s) => s.notRequired(),
      }),
      no_brand: boolean().required(),
      product_id: string().when('no_product_id', {
        is: false,
        then: (s) => s.required(tr.required),
        otherwise: (s) => s.notRequired(),
      }),
      no_product_id: boolean().required()
    })
  }

  static identityFormValues() {
    return { title: '', category: '', has_variations: false, brand_name: '', no_brand: false, product_id: '', no_product_id: false }
  }

  static descriptionForm(tr: ObjString) {
    return object().shape({
      description: string().min(PRODUCT_DESCRIPTION_MIN_LENGTH, tr.descErr).max(PRODUCT_DESCRIPTION_MAX_LENGTH, tr.descErr).required(tr.descErr),
      bullet_points: array()
        .min(1, 'at least one bullet should be provided')
        .of(
          object().shape({
            id: string().required(),
            bullet_point: string().min(PRODUCT_BULLET_POINT_MIN_LENGTH, tr.bulletErr).max(PRODUCT_BULLET_POINT_MAX_LENGTH, tr.bulletErr).typeError(tr.bulletErr)
          }),
        ),
    })
  }

  static descriptionFormValues() {
    return { description: '', bullet_points: [{ id: Date.now().toString(), bullet_point: '' }] }
  }

  static offerForm(tr: ObjString) {
    return object().shape({
      sku: string().min(PRODUCT_SKU_MIN_LENGTH, tr.skuErr).max(PRODUCT_SKU_MAX_LENGTH, tr.skuErr).required(tr.skuErr),
      quantity: number().when('fulfillment_type', {
        is: PRODUCT_FULFILLMENT_TYPE.Supplier,
        then: (s: any) => s.min(PRODUCT_MINIMUM_INVENTORY_QUANTITY, tr.quanityErr).required(tr.quanityErr),
        otherwise: (s: any) => s.notRequired()
      }),
      price: number().typeError(tr.bgrThan0).min(0, tr.bgrThan0).required(tr.required),
      currency: string().required(tr.required),
      fulfillment_type: string().oneOf(Object.values(PRODUCT_FULFILLMENT_TYPE), tr.invInp).required(tr.required),
      offering_condition: string().oneOf(Object.values(PRODUCT_OFFERING_CONDITION), tr.invInp).required(tr.required),

      // condition_note stays nullable string
      condition_note: string()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .when('offering_condition', {
          is: PRODUCT_OFFERING_CONDITION.Used,
          then: (s: any) => s.min(PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH, tr.condNoteErr).max(PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH, tr.condNoteErr).nullable(),
          otherwise: (s: any) => s.nullable()
        }),

      list_price: number()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .typeError(tr.bgrThan0)
        .moreThan(0, tr.bgrThan0)
        .test('list-gte-your', tr.lsPriceErr, function (value) {
          if (value == null) return true;
          const price = this.parent?.price;
          if (price == null || price === '') return true;

          const vNum = Number(value), pNum = Number(price);
          if (Number.isNaN(vNum) || Number.isNaN(pNum)) return false;
          return vNum >= pNum;
        }),

      sale_price: number()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .typeError(tr.bgrThan0)
        .moreThan(0, tr.bgrThan0)
        .test('required-if-dates', tr.required, function (value) {
          const { sale_price_start, sale_price_end } = this.parent;
          if ((sale_price_start || sale_price_end) && (value === null || value === undefined || value.toString() === '')) {
            return false;
          }
          return true;
        }),

      // important: use string().nullable() for dates to match your interface (ISO strings)
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
                const start = this.parent?.sale_price_start as string | null | undefined;
                if (!end || !start) return true;
                return new Date(end) > new Date(start);
              }
            ),
        }),

      processing_time: number().moreThan(0, tr.bgrThan0).required(tr.required),
      has_minimum_orders: boolean(),
      minimum_orders: array().of(
        object().shape({
          id: string().required(),
          price: number().typeError(tr.invNum).moreThan(0, tr.bgrThan0).required(tr.required),
          quantity: number().typeError(tr.invNum).moreThan(0, tr.bgrThan0).required(tr.required),
        })
      )
    })
  }

  static offerFormValues() {
    return {
      sku: "",
      quantity: 0,
      price: 0,
      currency: '',
      offering_condition: '',
      condition_note: '',
      list_price: null,
      fulfillment_type: '',
      sale_price: null,
      sale_price_start: null,
      sale_price_end: null,
      processing_time: 0,
      has_minimum_orders: false,
      minimum_orders: null
    };
  }
}
