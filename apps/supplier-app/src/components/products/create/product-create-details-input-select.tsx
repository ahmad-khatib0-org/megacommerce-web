import { Select } from "@mantine/core"
import { SubcategoryAttribute, SubcategoryTranslations } from "@megacommerce/proto/web/products/v1/product_categories"
import { ValueLabel } from "@megacommerce/shared"

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  field: any
  label: string
  trans: SubcategoryTranslations
}

function ProductCreateDetailsInputSelect({ fieldData, fieldName, field, label, trans }: Props) {
  const selectData: ValueLabel[] = Object
    .entries(trans.data[fieldName].values)
    .map(([label, value]) => ({ label, value, }));

  return (
    <Select
      key={fieldName}
      label={label}
      placeholder={label}
      aria-label={label}
      data={selectData}
      allowDeselect={!fieldData.required}
      withAsterisk
      size="sm"
      {...field}
    />
  );
}

export default ProductCreateDetailsInputSelect
