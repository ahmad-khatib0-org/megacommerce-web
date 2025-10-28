import { RefObject, useMemo } from "react"
import { NumberInput, Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"

import { currencies } from "@megacommerce/ui/shared"
import { ObjString, ValueLabel } from "@megacommerce/shared"
import ProductCreateOfferWithoutVariations, { ProductCreateOfferWithoutVariationsForm } from "@/components/products/create/product-create-offer-without-variations"
import ProductCreateOfferWithVariations, { ProductCreateOfferWithVariationsHandler } from "@/components/products/create/product-create-offer-with-variations"

type Props = {
  tr: ObjString
  form: ProductCreateOfferForm
  withouVariantForm: ProductCreateOfferWithoutVariationsForm
  withVariantFormRef: RefObject<ProductCreateOfferWithVariationsHandler | null>
  offering: ValueLabel[]
  filfillment: ValueLabel[]
  hasVariations: boolean
}

export type ProductCreateOfferForm = UseFormReturnType<ProductCreateOfferFormValues>

/**
  * @field processing_time Days until shipping starts
*/
export interface ProductCreateOfferFormValues {
  currency: string;
  fulfillment_type: string;
  processing_time: number;
}

export interface ProductCreateOfferPriceFormValues {
  sku: string;
  quantity: number;
  price: number;
  offering_condition: string;
  condition_note: string | null;
  list_price: number | null;
  has_sale_price: boolean
  sale_price: number | null;
  sale_price_start: string | null;
  sale_price_end: string | null;
  has_minimum_orders: boolean
  minimum_orders: { id: string; price: number; quantity: number }[] | null; // optional
}

function ProductCreateOffer({ tr, form, offering, filfillment, hasVariations, withouVariantForm, withVariantFormRef }: Props) {
  const cur = useMemo(() => Object.keys(currencies).map((c) => c), [currencies])

  return (
    <div className='relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto'>
      <Select
        label={tr.filType}
        placeholder={tr.filType}
        aria-label={tr.filType}
        data={filfillment}
        allowDeselect={false}
        withAsterisk
        size="sm"
        {...form.getInputProps('fulfillment_type')}
      />
      <NumberInput
        label={tr.procTime}
        placeholder={tr.procTime}
        aria-label={tr.procTime}
        withAsterisk
        size="sm"
        {...form.getInputProps('processing_time')}
      />
      <Select
        label={tr.currency}
        placeholder={tr.currency}
        aria-label={tr.currency}
        data={cur}
        withAsterisk
        allowDeselect={false}
        size="sm"
        searchable
        {...form.getInputProps('currency')}
      />
      {!hasVariations && <ProductCreateOfferWithoutVariations tr={tr} offering={offering} form={withouVariantForm} />}
      {hasVariations && <ProductCreateOfferWithVariations ref={withVariantFormRef} tr={tr} offering={offering} />}
    </div>
  )
}

export default ProductCreateOffer
