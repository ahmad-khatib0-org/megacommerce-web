import { Select } from "@mantine/core"

import { SubcategoryAttribute, SubcategoryAttributeTranslation, SubcategoryTranslations } from "@megacommerce/proto/web/products/v1/product_categories"
import { ValueLabel } from "@megacommerce/shared"

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  fieldTrans: SubcategoryAttributeTranslation
  field: any
  trans: SubcategoryTranslations
}

function ProductCreateDetailsInputSelect({ fieldData, fieldName, fieldTrans, field, trans }: Props) {
  const selectData: ValueLabel[] = Object
    .entries(trans.data[fieldName].values)
    .map(([label, value]) => ({ label, value, }));

  return (
    <Select
      label={fieldTrans.label}
      placeholder={fieldTrans.placeholder}
      aria-label={fieldTrans.label}
      data={selectData}
      allowDeselect={!fieldData.required}
      withAsterisk
      size="sm"
      {...field}
    />
  );
}

export default ProductCreateDetailsInputSelect
