import 'client-only'
import { array, boolean as booleanSchema, number, object, string, TestContext } from "yup";

import { ProductDataResponseData } from '@megacommerce/proto/web/products/v1/product_data';
import { NumericRuleType, StringRuleType } from '@megacommerce/proto/web/shared/v1/validation';
import { tr as translator } from '@megacommerce/shared/client';
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
  PRODUCT_VARIATION_TITLE_MIN_LENGTH,
  PRODUCT_VARIATION_TITLE_MAX_LENGTH,
} from '@megacommerce/shared';
import { SubcategoryAttribute } from '@megacommerce/proto/web/products/v1/product_categories';

export class Products {
  constructor() { }

  static identityForm(tr: ObjString) {
    return object().shape({
      title: string().min(PRODUCT_TITLE_MIN_LENGTH, tr.titErr).max(PRODUCT_TITLE_MAX_LENGTH, tr.titErr).required(tr.titErr),
      category: string().required(tr.proTypeErr),
      subcategory: string().required(tr.proTypeErr),
      has_variations: booleanSchema().optional(),
      brand_name: string().when('no_brand', {
        is: false,
        then: (s) => s.min(PRODUCT_BRAND_NAME_MIN_LENGTH).max(PRODUCT_BRAND_NAME_MAX_LENGTH).required(tr.brandErr),
        otherwise: (s) => s.notRequired(),
      }),
      no_brand: booleanSchema().required(),
      product_id: string().when('no_product_id', {
        is: false,
        then: (s) => s.required(tr.required),
        otherwise: (s) => s.notRequired(),
      }),
      no_product_id: booleanSchema().required()
    })
  }

  static identityFormValues() {
    return {
      title: '',
      category: '',
      subcategory: '',
      has_variations: false,
      brand_name: '',
      no_brand: false,
      product_id: '',
      no_product_id: false,
    }
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
      has_minimum_orders: booleanSchema(),
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

  static buildProductDetailsWithoutVariationsFormFields(fields: ProductDataResponseData, tr: ObjString, lang: string,) {
    const data = fields.subcategory?.data;
    const trans = fields.subcategory?.translations;
    if (!data || !trans) return {
      formFields: {} as { [key: string]: any },
      initialVals: {} as Record<string, any>,
      formShape: undefined
    };

    const { formFields, initialVals } = this.buildFormFieldsValidators(lang, tr, data.attributes)

    const formShape = object().shape(formFields);
    return { formShape, initialVals };
  }

  static buildProductDetailsWithVariationsFormFields(fields: ProductDataResponseData, tr: ObjString, lang: string,) {
    const { fieldsVariations, fieldsShared, trans } = this.buildProductDetailsFormFieldsVariations(fields)

    const { formFields: sharedFormFields, initialVals: sharedInitialValues } = this.buildFormFieldsValidators(lang, tr, fieldsShared)
    const { formFields: varFormFields, initialVals: variationsInitialVals } = this.buildFormFieldsValidators(lang, tr, fieldsVariations)

    const variationsFormFields = {
      ...varFormFields,
      "id": string(),
      "title": string()
        .required(tr.required)
        .min(PRODUCT_VARIATION_TITLE_MIN_LENGTH, translator(lang, 'form.fields.min', { Min: PRODUCT_VARIATION_TITLE_MIN_LENGTH }))
        .max(PRODUCT_VARIATION_TITLE_MAX_LENGTH, translator(lang, 'form.fields.max', { Max: PRODUCT_VARIATION_TITLE_MAX_LENGTH }))
    }
    const variationsInitialValues: { variations: Record<string, any>[] } = { variations: [{ ...variationsInitialVals, "title": "", "id": Date.now().toString() }] }

    const sharedFormShape = object().shape(sharedFormFields);
    const variationsFormShape = object().shape({
      variations: array().of(object().shape(variationsFormFields))
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
    const trans = productDetailsData.subcategory?.translations!;
    const attrs = productDetailsData.subcategory?.data!.attributes ?? {};
    const fieldsVariations: { [key: string]: SubcategoryAttribute } = {}
    const fieldsShared: { [key: string]: SubcategoryAttribute } = {}

    for (const field of Object.entries(attrs)) {
      if (field[1].includeInVariants) fieldsVariations[field[0]] = field[1]
      else fieldsShared[field[0]] = field[1]
    }

    return { attrs, trans, fieldsVariations, fieldsShared }
  }

  private static buildFormFieldsValidators(lang: string, tr: ObjString, attrs: { [key: string]: SubcategoryAttribute }) {
    const formFields: { [key: string]: any } = {};
    const initialVals: Record<string, any> = {};

    for (const [fieldName, fieldData] of Object.entries(attrs)) {
      if (fieldData.type === "input") {
        initialVals[fieldName] = "";
        const str = fieldData.validation?.str;
        const num = fieldData.validation?.numeric;
        const required = fieldData.required;

        if (str) {
          let schema = required ? string().required(tr.required) : string();
          for (const rule of str.rules) {
            if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min_length', { Min: rule.value }));
            } else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max_length', { Max: rule.value }));
            }
          }
          formFields[fieldName] = schema;
        } else if (num) {
          let schema = required ? number().required(tr.required).typeError(tr.invNum) : number().typeError(tr.invNum);
          for (const rule of num.rules) {
            if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min', { Min: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max', { Max: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_GT) {
              schema = schema.moreThan(rule.value, translator(lang, 'form.fields.greater_than', { Max: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_LT) {
              schema = schema.lessThan(rule.value, translator(lang, 'form.fields.less_than', { Min: rule.value }));
            }
          }
          formFields[fieldName] = schema;
        }

      } else if (fieldData.type === "select") {
        initialVals[fieldName] = "";
        let schema = fieldData.required ? string().required(tr.required) : string();
        schema = schema.oneOf(fieldData.stringArray, tr.invInp);
        formFields[fieldName] = schema;

      } else if (fieldData.type === "boolean") {
        initialVals[fieldName] = false;
        formFields[fieldName] = booleanSchema()
      }
    }

    return { formFields, initialVals }
  }
}
