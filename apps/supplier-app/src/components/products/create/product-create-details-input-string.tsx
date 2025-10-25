import { NumberInput, TextInput } from "@mantine/core"

import { SubcategoryAttribute } from "@megacommerce/proto/web/products/v1/product_categories"
import { StringRuleType } from "@megacommerce/proto/web/shared/v1/validation"

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  field: any
  label: string
}

function ProductCreateDetailsInputString({ fieldData, fieldName, field, label }: Props) {
  const str = fieldData.validation?.str;
  const num = fieldData.validation?.numeric;
  const regex = fieldData.validation?.regex

  if (str) {
    let minLength = 0;
    let maxLength = 0;
    for (const rule of str.rules) {
      if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) minLength = rule.value;
      else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) maxLength = rule.value;
    }

    return (
      <TextInput
        label={label}
        placeholder={label}
        aria-label={label}
        withAsterisk
        size="sm"
        minLength={minLength}
        maxLength={maxLength}
        {...field}
      />
    );
  } else if (num) {
    return (
      <NumberInput
        label={label}
        placeholder={label}
        aria-label={label}
        withAsterisk
        size="sm"
        {...field}
      />
    );
  }
}

export default ProductCreateDetailsInputString
