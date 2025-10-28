import { ChangeEvent, useEffect } from 'react'
import { Button, Checkbox, NumberInput, Select, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates'
import { IconSquareXFilled } from '@tabler/icons-react';
import { toast } from 'react-toastify';

import {
  ObjString,
  ValueLabel,
  PRODUCT_MINIMUM_ORDER_MAX_OPTIONS,
  PRODUCT_OFFERING_CONDITION,
} from "@megacommerce/shared"
import { Button as SharedButton } from "@megacommerce/ui/shared"
import { ProductCreateOfferPriceFormValues } from '@/components/products/create/product-create-offer';
import { useProductsStore } from '@/store';

type Props = {
  tr: ObjString
  offering: ValueLabel[]
  form: ProductCreateOfferWithoutVariationsForm
}

export type ProductCreateOfferWithoutVariationsForm = UseFormReturnType<ProductCreateOfferPriceFormValues>

function ProductCreateOfferWithoutVariations({ tr, offering, form }: Props) {
  const productOfferFormValues = useProductsStore((state) => state.product_offer_form_values)

  const onToggleMinOrder = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked
    if (value) {
      form.setFieldValue("minimum_orders", [{ id: Date.now().toString(), price: 0, quantity: 0 }])
      form.setFieldValue('has_minimum_orders', true)
    } else {
      const toastId = Date.now().toString()
      toast.warn(
        <div className="flex flex-col px-6">
          <p className="font-light">{tr.minOrdWarn}</p>
          <div className="flex gap-6 mt-2">
            <SharedButton onClick={() => toast.dismiss(toastId)} className="border border-orange-300">{tr.cancel}</SharedButton>
            <SharedButton
              className="bg-orange-400 text-white"
              onClick={() => {
                form.setFieldValue("minimum_orders", null)
                form.setFieldValue("has_minimum_orders", false)
                toast.dismiss(toastId)
              }}
            >{tr.confirm}</SharedButton>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false, toastId }
      );
    }
  }

  const onToggleSalePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked
    if (!value) {
      form.setFieldValue("sale_price", null)
      form.setFieldValue("sale_price_start", null)
      form.setFieldValue("sale_price_end", null)
      form.setFieldValue("has_sale_price", false)
    } else {
      form.setFieldValue("has_sale_price", true)
    }
  }

  const onAddMinOrder = () => {
    if ((form.getValues().minimum_orders ?? []).length >= PRODUCT_MINIMUM_ORDER_MAX_OPTIONS) {
      toast.error(tr.minOrdMax)
      return
    }
    const index = (form.getValues().minimum_orders?.length ?? 0)
    if (index === 0) return // in practice, this won't occur 
    form.insertListItem("minimum_orders", { id: Date.now().toString(), price: 0, quantity: 0 }, index)
  }

  const init = () => {
    const values = productOfferFormValues?.withoutVariant
    if (values) form.setValues(values)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <NumberInput
        label={tr.price}
        placeholder={tr.price}
        aria-label={tr.price}
        withAsterisk
        size="sm"
        {...form.getInputProps('price')}
      />
      <TextInput
        label={tr.sku}
        placeholder={tr.sku}
        aria-label={tr.sku}
        withAsterisk
        size="sm"
        {...form.getInputProps('sku')}
      />
      <NumberInput label={tr.quantity}
        placeholder={tr.quantity}
        aria-label={tr.quantity}
        withAsterisk
        size="sm"
        {...form.getInputProps('quantity')}
      />
      <div className="grid grid-cols-2 justify-center items-center gap-x-4">
        <Select
          label={tr.offCond}
          placeholder={tr.offCond}
          aria-label={tr.offCond}
          data={offering}
          allowDeselect={false}
          withAsterisk
          size="sm"
          {...form.getInputProps('offering_condition')}
        />
        {form.values.offering_condition === PRODUCT_OFFERING_CONDITION.Used &&
          <TextInput
            label={tr.note}
            placeholder={tr.note}
            aria-label={tr.note}
            withAsterisk
            size="sm"
            {...form.getInputProps('condition_note')}
          />
        }
      </div>
      <NumberInput
        label={tr.lsPrice}
        placeholder={tr.lsPrice}
        aria-label={tr.lsPrice}
        size="sm"
        {...form.getInputProps('list_price')}
      />
      <div className='grid grid-cols-2 justify-center items-center gap-x-4'>
        <Checkbox
          label={tr.salePrcAdd}
          checked={form.values.has_sale_price}
          className='font-medium cursor-pointer'
          styles={{ label: { fontSize: 16 } }}
          value={form.values.has_sale_price.toString()}
          onChange={onToggleSalePrice}
        />
        {form.values.has_sale_price && <>
          <NumberInput
            label={tr.salePrice}
            placeholder={tr.salePrice}
            aria-label={tr.salePrice}
            size="sm"
            {...form.getInputProps('sale_price')}
          />
          <DatePickerInput
            label={tr.saleStart}
            placeholder={tr.saleStart}
            aria-label={tr.saleStart}
            {...form.getInputProps('sale_price_start')}
          />
          <DatePickerInput
            label={tr.saleEnd}
            placeholder={tr.saleEnd}
            aria-label={tr.saleEnd}
            {...form.getInputProps('sale_price_end')}
          />
        </>}
      </div>
      <Checkbox
        label={tr.minOrd}
        checked={form.values.has_minimum_orders}
        className='font-medium mt-4 cursor-pointer'
        styles={{ label: { fontSize: 16 } }}
        value={form.values.has_minimum_orders.toString()}
        onChange={onToggleMinOrder}
      />
      {(form.values.minimum_orders?.length ?? 0) > 0 && <div className="flex flex-col gap-y-4">
        {(form.values.minimum_orders ?? []).map((mo, idx) => <div
          key={mo.id}
          className={`relative grid grid-cols-2 justify-center items-center gap-x-4 pt-2`}>
          {idx > 0 && <div
            onClick={() => form.removeListItem("minimum_orders", idx)}
            className="absolute right-0 top-0 cursor-pointer">
            <IconSquareXFilled aria-label={tr.delItem} />
          </div>}
          <NumberInput
            label={tr.itemPrice}
            placeholder={tr.itemPrice}
            aria-label={tr.itemPrice}
            withAsterisk
            size="sm"
            {...form.getInputProps(`minimum_orders.${idx}.price`)}
          />
          <NumberInput
            label={tr.minCount}
            placeholder={tr.minCount}
            aria-label={tr.minCount}
            withAsterisk
            size="sm"
            {...form.getInputProps(`minimum_orders.${idx}.quantity`)}
          />
        </div>)}
        <Button
          className="bg-orange-500 text-white font-bold hover:bg-orange-400 w-max px-12 py-1 mt-4"
          onClick={() => onAddMinOrder()}
        >{tr.addMore}</Button>
      </div>
      }
    </>
  )
}

export default ProductCreateOfferWithoutVariations
