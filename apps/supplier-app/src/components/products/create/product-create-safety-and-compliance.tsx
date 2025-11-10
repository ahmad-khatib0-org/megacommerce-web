import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, UseFormReturnType } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'

import { StringRuleType } from '@megacommerce/proto/web/shared/v1/validation'
import { ObjString, ValueLabel } from '@megacommerce/shared'
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

    if (!safety) return null

    const { formShape, initialVals } = Products.safetyForm(data, tr, lang)

    const form = useForm({
      initialValues: initialVals,
      validateInputOnBlur: true,
      validate: yupResolver(formShape!),
    })

    useImperativeHandle(ref, () => ({
      getForm: () => form,
    }))

    useEffect(() => {
      if (Object.keys(formValues).length > 0) form.setValues(formValues)
    }, [])

    const trans = data.subcategory?.translations?.safety

    return (
      <div className='relative flex flex-col gap-y-4 w-full max-w-[800px]'>
        {Object.keys(safety).map((field) => {
          const type = safety[field].type
          const required = safety[field].required
          const isMultipe = safety[field].isMultiple
          const validation = safety[field].validation
          const label = trans?.attributes[field].label
          const placeholder = trans?.attributes[field].placeholder

          if (type === 'input') {
            const str = validation?.str
            const num = validation?.numeric
            const regex = validation?.regex

            if (str) {
              let minLength = 0
              let maxLength = 0
              for (const rule of str.rules) {
                if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) minLength = rule.value
                else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) maxLength = rule.value
              }

              return (
                <TextInput
                  key={field}
                  label={label}
                  placeholder={placeholder}
                  aria-label={label}
                  withAsterisk
                  size='sm'
                  minLength={minLength}
                  maxLength={maxLength}
                  {...form.getInputProps(field)}
                />
              )
            } else if (num) {
              return (
                <NumberInput
                  key={field}
                  label={label}
                  placeholder={placeholder}
                  aria-label={label}
                  withAsterisk
                  size='sm'
                  {...form.getInputProps(field)}
                />
              )
            }
          } else if (type === 'select') {
            const selectData: ValueLabel[] = []
            for (const [key, value] of Object.entries(trans?.data[field].values ?? {})) {
              selectData.push({ label: value, value: key })
            }

            return (
              <Select
                key={field}
                label={label}
                placeholder={placeholder}
                aria-label={label}
                data={selectData}
                allowDeselect={!required}
                withAsterisk
                size='sm'
                {...form.getInputProps(field)}
              />
            )
          } else if (type === 'boolean') {
            return (
              <Checkbox
                key={field}
                label={label}
                placeholder={placeholder}
                aria-label={label}
                className='font-medium mt-4'
                styles={{ label: { fontSize: 16 } }}
                {...form.getInputProps(field)}
              />
            )
          }
          return null
        })}
        <Checkbox
          label={tr.attestation}
          placeholder={tr.attestation}
          aria-label={tr.attestation}
          className='font-medium mt-4'
          styles={{ label: { fontSize: 16 } }}
          {...form.getInputProps('attestation')}
        />
      </div>
    )
  }
)

export default ProductCreateSafetyAndCompliance
