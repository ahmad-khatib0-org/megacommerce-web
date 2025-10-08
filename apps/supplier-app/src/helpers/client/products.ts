import 'client-only'
import { array, boolean, object, string } from "yup";
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
}
