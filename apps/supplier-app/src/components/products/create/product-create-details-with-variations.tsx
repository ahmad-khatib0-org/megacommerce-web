import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Button, HoverCard, TextInput } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconHelpOctagon, IconInfoOctagon } from "@tabler/icons-react";
import { toast } from "react-toastify";

import { ProductDataResponseData } from "@megacommerce/proto/web/products/v1/product_data";
import { ObjString, PRODUCT_VARIATION_TITLE_MAX_LENGTH, PRODUCT_VARIATION_TITLE_MIN_LENGTH } from "@megacommerce/shared";
import { Button as SharedButton } from "@megacommerce/ui/shared"

import ProductCreateDetailsInputWrapper from "@/components/products/create/product-create-details-input-wrapper";
import { ProductCreateDetailsHandlers } from "@/components/products/create/product-create-details";
import { useProductsStore } from "@/store";
import { Products } from "@/helpers/client";

type Props = {
  tr: ObjString;
  productDetailsData: ProductDataResponseData
  lang: string
}

export type ProductVariationsForm = UseFormReturnType<ProductVariationsFormValues>

export interface ProductVariationsFormValues {
  variations: Record<string, any>[];
}

const ProductCreateDetailsWithVariations = forwardRef<ProductCreateDetailsHandlers, Props>(({ tr, productDetailsData, lang }, ref) => {
  const productDetailsFormValues = useProductsStore((state) => state.product_details_form_values)
  const productDetailsVariationFormValues = useProductsStore((state) => state.product_details_variations_form_values)
  const {
    trans,
    fieldsShared,
    fieldsVariations,
    sharedFormShape,
    sharedInitialValues,
    variationsFormShape,
    variationsInitialValues
  } = Products.buildProductDetailsWithVariationsFormFields(productDetailsData, tr, lang);

  const sharedForm = useForm({
    initialValues: sharedInitialValues,
    validateInputOnBlur: true,
    validate: yupResolver(sharedFormShape),
  });

  const variationForm = useForm({
    initialValues: variationsInitialValues,
    validateInputOnBlur: true,
    validate: yupResolver(variationsFormShape),
  });

  const addAnotherVar = () => {
    const length = variationForm.values.variations.length
    variationForm.insertListItem("variations", variationsInitialValues.variations[0], length)
  }

  const removeVariant = (idx: number) => {
    const toastId = Date.now().toString()
    toast.warn(
      <div className="flex flex-col px-6">
        <p className="font-light">{tr.varRmWarn}</p>
        <div className="flex gap-6 mt-2">
          <SharedButton
            onClick={() => toast.dismiss(toastId)}
            className="border border-orange-300"
          >{tr.can}</SharedButton>
          <SharedButton
            className="bg-orange-400 text-white"
            onClick={() => {
              variationForm.removeListItem("variations", idx)
              toast.dismiss(toastId)
            }}>{tr.confirm}</SharedButton>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, toastId }
    );
  }

  useImperativeHandle((ref), () => ({
    getForm: () => sharedForm,
    getVariationsForm: () => variationForm
  }))

  useEffect(() => {
    if (Object.keys(productDetailsFormValues).length > 0) sharedForm.setValues(productDetailsFormValues)
    if (productDetailsVariationFormValues.variations.length > 0) variationForm.setValues(productDetailsVariationFormValues)
  }, [])

  return <>
    {(Object.keys(fieldsShared).length > 0) &&
      <>
        <div className="flex items-start gap-x-2">
          <IconInfoOctagon color="orange" />
          <p className="text-center">{tr.shVarDesc}</p>
        </div>
        {Object.entries(fieldsShared).map(([fieldName, fieldData]) => {
          return <ProductCreateDetailsInputWrapper
            key={fieldName}
            field={sharedForm.getInputProps(fieldName)}
            fieldData={fieldData}
            fieldName={fieldName}
            trans={trans}
          />
        })}
      </>
    }
    {(Object.keys(fieldsVariations).length > 0) &&
      <>
        <div className="flex items-start justify-center gap-x-2 mt-4 border border-orange-500 border-dashed py-6">
          <IconInfoOctagon color="orange" />
          <p className="text-center">{tr.variations}</p>
        </div>
        {variationForm.values.variations.map((variation, idx) => {
          return <div
            key={idx}
            className="flex flex-col border border-black/25 rounded-md px-2 py-4 gap-y-4">
            <TextInput
              label={
                <div className="flex justify-center items-center gap-x-2">
                  <p>{tr.varTitle}</p>
                  <p className="text-red-500 text-xl">*</p>
                  <HoverCard width={400} shadow="md">
                    <HoverCard.Target>
                      <IconHelpOctagon size={18} />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <p>{tr.varDesc}</p>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </div>
              }
              placeholder={tr.varTitle}
              aria-label={tr.varTitle}
              size="sm"
              minLength={PRODUCT_VARIATION_TITLE_MIN_LENGTH}
              maxLength={PRODUCT_VARIATION_TITLE_MAX_LENGTH}
              {...variationForm.getInputProps(`variations.${idx}.title`)}
            />
            {Object.entries(variation).map((field) => {
              if (field[0] === 'title') return null
              return <ProductCreateDetailsInputWrapper
                key={field[0]}
                field={variationForm.getInputProps(`variations.${idx}.${field[0]}`)}
                fieldData={fieldsVariations[field[0]]}
                fieldName={field[0]}
                trans={trans}
              />
            })}
            {idx !== 0 && <Button
              onClick={() => removeVariant(idx)}
              className="w-max px-4"
              variant="outline"
            >{tr.rmVar}</Button>}
          </div>
        })}
        <div className="flex justify-end">
          <Button onClick={() => addAnotherVar()} variant="outline">{tr.addVar}</Button>
        </div>
      </>
    }
  </>
})

export default ProductCreateDetailsWithVariations
