import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, UseFormReturnType } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'

import { ObjString } from '@megacommerce/shared'
import { Products } from '@/helpers/client'
import { useProductsStore } from '@/store'

type Props = {
  tr: ObjString
  lang: string
}

export interface ProductCreateSafetyAndCompliance {
  getForm: () => UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>
}

const ProductCreateSafetyAndCompliance = forwardRef<ProductCreateSafetyAndCompliance, Props>(
  ({ tr, lang }, ref) => {
    const formValues = useProductsStore((state) => state.product_safety_form_values)
    const data = useProductsStore((state) => state.product_details_data)
    const safety = data?.subcategory?.data?.safety

    if (!safety) return

    const { formShape, initialVals } = Products.safetyForm(data, tr, lang)

    const form = useForm({
      initialValues: initialVals,
      validateInputOnBlur: true,
      validate: yupResolver(formShape!),
    })

    form.getValues()

    useImperativeHandle(ref, () => ({
      getForm: () => form,
    }))

    useEffect(() => {
      if (Object.keys(formValues).length > 0) form.setValues(formValues)
    }, [])

    return <div className='relative flex flex-col gap-y-4 w-full max-w-[800px]'></div>
  }
)

export default ProductCreateSafetyAndCompliance
