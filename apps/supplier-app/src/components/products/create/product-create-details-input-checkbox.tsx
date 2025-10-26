import { Checkbox } from "@mantine/core"
import { SubcategoryAttribute, SubcategoryAttributeTranslation } from "@megacommerce/proto/web/products/v1/product_categories"

type Props = {
  fieldData: SubcategoryAttribute
  fieldTrans: SubcategoryAttributeTranslation
  field: any
}

function ProductCreateDetailsInputCheckbox({ fieldData, fieldTrans, field }: Props) {
  return <Checkbox
    label={fieldTrans.label}
    aria-label={fieldTrans.label}
    className="font-medium mt-4"
    styles={{ label: { fontSize: 16 } }}
    {...field}
  />
}

export default ProductCreateDetailsInputCheckbox
