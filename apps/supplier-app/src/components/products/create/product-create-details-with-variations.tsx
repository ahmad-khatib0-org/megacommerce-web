import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconInfoOctagon } from "@tabler/icons-react";

import { ProductDataResponseData } from "@megacommerce/proto/web/products/v1/product_data";
import { ObjString } from "@megacommerce/shared";

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
        <div className="border border-black/25 rounded-md px-2 py-4">
          {variationForm.values.variations.map((variation, idx) => {
            return <div key={idx} className="flex flex-col gapy-y-3">
              {Object.entries(variation).map((field) => {
                return <ProductCreateDetailsInputWrapper
                  key={field[0]}
                  field={variationForm.getInputProps(`variations.${idx}.${field[0]}`)}
                  fieldData={fieldsVariations[field[0]]}
                  fieldName={field[0]}
                  trans={trans}
                />
              })}
            </div>
          })}
        </div>
      </>
    }
  </>
})

export default ProductCreateDetailsWithVariations
