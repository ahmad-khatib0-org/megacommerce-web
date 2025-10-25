import { Checkbox } from "@mantine/core"
import { SubcategoryAttribute } from "@megacommerce/proto/web/products/v1/product_categories"

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  field: any
  label: string
}

function ProductCreateDetailsInputCheckbox({ fieldData, fieldName, field, label }: Props) {
  return <Checkbox
    key={fieldName}
    label={label}
    aria-label={label}
    className="font-medium mt-4"
    styles={{ label: { fontSize: 16 } }}
    {...field}
  />
}

export default ProductCreateDetailsInputCheckbox
