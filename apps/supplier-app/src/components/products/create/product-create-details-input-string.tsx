import { NumberInput, TextInput } from '@mantine/core'

import { NumericRuleType, StringRuleType } from '@megacommerce/proto/web/shared/v1/validation'
import {
  SubcategoryAttribute,
  SubcategoryAttributeTranslation,
} from '@megacommerce/proto/web/products/v1/product_categories'

type Props = {
  fieldData: SubcategoryAttribute
  fieldTrans: SubcategoryAttributeTranslation
  field: any
}

// TODO: complete the regex field type and validation
function ProductCreateDetailsInputString({ fieldData, field, fieldTrans }: Props) {
  const str = fieldData.validation?.str
  const num = fieldData.validation?.numeric
  const regex = fieldData.validation?.regex

  if (str) {
    let minLength = 0
    let maxLength = 0
    for (const rule of str.rules) {
      if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) minLength = rule.value
      else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) maxLength = rule.value
    }

    return (
      <TextInput
        label={fieldTrans.label}
        placeholder={fieldTrans.placeholder}
        aria-label={fieldTrans.label}
        withAsterisk={fieldData.required}
        size='sm'
        minLength={minLength}
        maxLength={maxLength}
        {...field}
      />
    )
  } else if (num) {
    let min: number | undefined = undefined
    let max: number | undefined = undefined
    for (const rule of num.rules) {
      if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MIN) min = rule.value
      if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MAX) max = rule.value
    }
    return (
      <NumberInput
        label={fieldTrans.label}
        placeholder={fieldTrans.placeholder}
        aria-label={fieldTrans.label}
        withAsterisk={fieldData.required}
        size='sm'
        min={min}
        max={max}
        {...field}
      />
    )
  }
}

export default ProductCreateDetailsInputString
