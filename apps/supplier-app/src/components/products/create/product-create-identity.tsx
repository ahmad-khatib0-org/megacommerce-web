import { useState } from 'react'
import { Checkbox, Combobox, TextInput, useCombobox } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

import { IDName, ObjString } from "@megacommerce/shared"

type Props = {
  tr: ObjString
  form: ProductCreateIdentityForm
  categories: Category[]
}

export interface Category {
  id: string,
  name: string
  image: string
  subcategories: IDName[]
}

export type ProductCreateIdentityForm = UseFormReturnType<ProductCreateIdentityFormValues>

export interface ProductCreateIdentityFormValues {
  title: string
  category: string
  has_variations: boolean
  brand_name: string
  no_brand: boolean
  product_id: string
  no_product_id: boolean
}

function ProductCreateIdentity({ tr, form, categories }: Props) {
  const combobox = useCombobox();
  const [inputValue, setInputValue] = useState('');
  const [_, setCategoryName] = useState('');

  const normalized = inputValue.trim().toLowerCase();
  const filteredOptions = normalized.length === 0
    ? categories
    : categories.filter(c =>
      c.subcategories.some(s => s.name.toLowerCase().includes(normalized))
    );

  const options = filteredOptions.map((c) => (
    <Combobox.Group label={c.name} aria-label={c.name} key={c.id}>
      {c.subcategories
        .filter(s => normalized.length === 0 || s.name.toLowerCase().includes(normalized))
        .map((s) => (
          <Combobox.Option
            value={s.id}
            key={s.id}
            onClick={() => {
              // when selecting, update both selected id (value sent to form) and visible name
              form.setFieldValue('category', s.id);
              setInputValue(s.name);
              setCategoryName(s.name);
              combobox.closeDropdown();
            }}
            aria-label={s.name}
          >
            {s.name}
          </Combobox.Option>
        ))}
    </Combobox.Group>
  ));

  return (
    <div className='relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto'>
      <TextInput
        label={tr.proTitle}
        placeholder={tr.proTitle}
        withAsterisk
        size="sm"
        {...form.getInputProps('title')}
      />
      <Combobox store={combobox}>
        <Combobox.Target>
          <TextInput
            label={tr.proType}
            withAsterisk
            placeholder="Pick value or type anything"
            value={inputValue}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            onChange={(event) => {
              const v = event.currentTarget.value;
              setInputValue(v);
              setCategoryName('');
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex()
            }}
          />
        </Combobox.Target>
        <Combobox.Dropdown className='max-h-80 overflow-y-auto z-10'>
          <Combobox.Options>
            {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
          </Combobox.Options>
        </Combobox.Dropdown>
        {form.getInputProps("category").error ? <p className='text-red-500 text-sm'>{form.getInputProps('category').error}</p> : null}
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
        size="sm"
        {...form.getInputProps('brand_name')}
      />
      <Checkbox
        label={tr.noBrand}
        checked={form.values.no_brand}
        className='font-medium'
        styles={{ label: { fontSize: 16 } }}
        {...form.getInputProps('no_brand')}
      />
      <TextInput
        label={tr.proID}
        placeholder={tr.proID}
        withAsterisk
        size="sm"
        {...form.getInputProps('product_id')}
      />
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
