import { Checkbox } from '@mantine/core'
import {
  SubcategoryAttribute,
  SubcategoryTranslations,
} from '@megacommerce/proto/web/products/v1/product_categories'

import ProductCreateDetailsInputString from '@/components/products/create/product-create-details-input-string'
import ProductCreateDetailsInputSelect from '@/components/products/create/product-create-details-input-select'

type Props = {
  fieldData: SubcategoryAttribute
  fieldName: string
  field: any
  trans: SubcategoryTranslations
}

function ProductCreateDetailsInputWrapper({ fieldData, fieldName, field, trans }: Props) {
  const fieldTrans = trans.attributes[fieldName]
  const type = fieldData.type
  const sharedProps = { fieldData, field, fieldTrans }

  if (type === 'input') {
    return <ProductCreateDetailsInputString {...sharedProps} />
  } else if (type === 'select') {
    return <ProductCreateDetailsInputSelect trans={trans} fieldName={fieldName} {...sharedProps} />
  } else if (type === 'boolean') {
    return (
      <Checkbox
        label={
          fieldData.required ? (
            <div className='flex justify-center gap-x-1'>
              <p>{fieldTrans.label}</p>
              <span className='block text-red-500'>*</span>
            </div>
          ) : (
            <p>{fieldTrans.label}</p>
          )
        }
        aria-label={fieldTrans.label}
        className='font-medium mt-4'
        required={fieldData.required}
        styles={{ label: { fontSize: 16 } }}
        {...field}
      />
    )
  }
  return null
}

export default ProductCreateDetailsInputWrapper
