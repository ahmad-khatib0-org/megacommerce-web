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

// TODO: complete the regex field type and validation
function ProductCreateDetailsInputWrapper({ fieldData, fieldName, field, trans }: Props) {
  const fieldTrans = trans.attributes[fieldName];
  const type = fieldData.type;
  const sharedProps = { fieldData, field, fieldTrans }

  if (type === "input") {
    return <ProductCreateDetailsInputString {...sharedProps} />
  } else if (type === "select") {
    return <ProductCreateDetailsInputSelect trans={trans} fieldName={fieldName} {...sharedProps} />
  } else if (type === "boolean") {
    return <ProductCreateDetailsInputCheckbox {...sharedProps} />
  }
  return null
}

export default ProductCreateDetailsInputWrapper
