import { SubcategoryAttribute, SubcategoryTranslations } from "@megacommerce/proto/web/products/v1/product_categories"

import ProductCreateDetailsInputString from "@/components/products/create/product-create-details-input-string";
import ProductCreateDetailsInputSelect from "@/components/products/create/product-create-details-input-select";
import ProductCreateDetailsInputCheckbox from "@/components/products/create/product-create-details-input-checkbox";

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  field: any
  trans: SubcategoryTranslations
}

function ProductCreateDetailsInputWrapper({ fieldData, fieldName, field, trans }: Props) {
  const label = trans.attributes[fieldName];
  const type = fieldData.type;
  const sharedProps = { fieldData, fieldName, field, label }

  if (type === "input") {
    return <ProductCreateDetailsInputString {...sharedProps} />
  } else if (type === "select") {
    return <ProductCreateDetailsInputSelect trans={trans} {...sharedProps} />
  } else if (type === "boolean") {
    return <ProductCreateDetailsInputCheckbox {...sharedProps} />
  }
  return null
}

export default ProductCreateDetailsInputWrapper
