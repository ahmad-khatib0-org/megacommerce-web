import { useEffect, useState } from 'react'
import { Checkbox, Combobox, Select, TextInput, useCombobox } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconMathGreater } from '@tabler/icons-react'

import {
  IDName,
  ObjString,
  PRODUCT_BRAND_NAME_MAX_LENGTH,
  PRODUCT_BRAND_NAME_MIN_LENGTH,
  PRODUCT_ID_TYPES,
  PRODUCT_TITLE_MAX_LENGTH,
  PRODUCT_TITLE_MIN_LENGTH,
} from '@megacommerce/shared'
import { useProductsStore } from '@/store'

type Props = {
  tr: ObjString
  form: ProductCreateIdentityForm
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  image: string
  subcategories: IDName[]
}

export type ProductCreateIdentityForm = UseFormReturnType<ProductCreateIdentityFormValues>

export interface ProductCreateIdentityFormValues {
  title: string
  category: string
  subcategory: string
  has_variations: boolean
  brand_name: string
  no_brand: boolean
  product_id: string
  product_id_type: string
  no_product_id: boolean
}

function ProductCreateIdentity({ tr, form, categories }: Props) {
  const combobox = useCombobox()
  const [inputValue, setInputValue] = useState('')
  const categoryInfo = useProductsStore((state) => state.product_category_info)
  const setCategoryInfo = useProductsStore((state) => state.set_product_category_info)

  const normalized = inputValue.trim().toLowerCase()
  const filteredOptions =
    normalized.length === 0
      ? categories
      : categories.filter((c) => c.subcategories.some((s) => s.name.toLowerCase().includes(normalized)))

  const options = filteredOptions.map((c) => (
    <Combobox.Group label={c.name} aria-label={c.name} key={c.id}>
      {c.subcategories
        .filter((s) => normalized.length === 0 || s.name.toLowerCase().includes(normalized))
        .map((s) => (
          <Combobox.Option
            value={s.id}
            key={s.id}
            onClick={() => {
              // when selecting, update both selected id (value sent to form) and visible name
              form.setFieldValue('category', c.id)
              form.setFieldValue('subcategory', s.id)
              setInputValue(s.name)
              setCategoryInfo({
                category: c.id,
                subcategory: s.id,
                category_name: c.name,
                subcategory_name: s.name,
              })
              combobox.closeDropdown()
            }}
            aria-label={s.name}>
            {s.name}
          </Combobox.Option>
        ))}
    </Combobox.Group>
  ))

  form.watch('brand_name', ({ value }) => {
    if (value && form.values.no_brand) form.setFieldValue('no_brand', false)
  })
  form.watch('no_brand', ({ value }) => {
    if (value && form.values.brand_name) form.setFieldValue('brand_name', '')
  })

  form.watch('product_id', ({ value }) => {
    if (value && form.values.no_product_id) form.setFieldValue('no_product_id', false)
  })
  form.watch('product_id_type', ({ value }) => {
    if (value && form.values.no_product_id) form.setFieldValue('no_product_id', false)
  })
  form.watch('no_product_id', ({ value }) => {
    if (value && form.values.product_id) form.setFieldValue('product_id', '')
    if (value && form.values.product_id_type) form.setFieldValue('product_id_type', '')
  })

  const init = () => {
    if (categoryInfo.subcategory && categoryInfo.subcategory) {
      setInputValue(categoryInfo.subcategory)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className='relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto'>
      <TextInput
        label={tr.proTitle}
        placeholder={tr.proTitle}
        withAsterisk
        size='sm'
        minLength={PRODUCT_TITLE_MIN_LENGTH}
        maxLength={PRODUCT_TITLE_MAX_LENGTH}
        {...form.getInputProps('title')}
      />
      <Combobox store={combobox}>
        <Combobox.Target>
          <TextInput
            label={tr.proType}
            withAsterisk
            placeholder='Pick value or type anything'
            value={inputValue}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            onChange={(event) => {
              const v = event.currentTarget.value
              setInputValue(v)
              combobox.openDropdown()
              combobox.updateSelectedOptionIndex()
            }}
          />
        </Combobox.Target>
        <Combobox.Dropdown className='max-h-80 overflow-y-auto z-10'>
          <Combobox.Options>
            {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
          </Combobox.Options>
        </Combobox.Dropdown>
        {form.getInputProps('category').error ? (
          <p className='text-red-500 text-sm'>{form.getInputProps('category').error}</p>
        ) : null}
        {categoryInfo.category && categoryInfo.subcategory && (
          <div className='flex items-center py-2 px-2 gap-x-4 border border-dashed border-black/25'>
            <p>{categoryInfo.category_name}</p>
            <IconMathGreater size={22} />
            <p>{categoryInfo.subcategory_name}</p>
          </div>
        )}
      </Combobox>
      <Checkbox
        label={tr.proHasVar}
        checked={form.values.has_variations}
        className='font-medium mt-4'
        styles={{ label: { fontSize: 16 } }}
        {...form.getInputProps('has_variations')}
      />
      <TextInput
        label={tr.brand}
        placeholder={tr.brand}
        withAsterisk
        size='sm'
        minLength={PRODUCT_BRAND_NAME_MIN_LENGTH}
        maxLength={PRODUCT_BRAND_NAME_MAX_LENGTH}
        {...form.getInputProps('brand_name')}
      />
      <Checkbox
        label={tr.noBrand}
        checked={form.values.no_brand}
        className='font-medium'
        styles={{ label: { fontSize: 16 } }}
        {...form.getInputProps('no_brand')}
      />
      <div className='grid grid-cols-2 gap-x-4'>
        <TextInput
          label={tr.proID}
          placeholder={tr.proID}
          withAsterisk
          size='sm'
          {...form.getInputProps('product_id')}
        />
        <Select
          label={tr.proIDType}
          placeholder={tr.proIDType}
          aria-label={tr.proIDType}
          data={Object.values(PRODUCT_ID_TYPES).map((typ) => ({ label: typ.toUpperCase(), value: typ }))}
          allowDeselect={true}
          withCheckIcon
          size='sm'
          {...form.getInputProps('product_id_type')}
        />
      </div>
      <Checkbox
        label={tr.noProID}
        checked={form.values.no_product_id}
        className='font-medium'
        styles={{ label: { fontSize: 16 } }}
        {...form.getInputProps('no_product_id', { type: 'checkbox' })}
      />
    </div>
  )
}

export default ProductCreateIdentity
