import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";

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

const ProductCreateDetailsWithoutVariations = forwardRef<ProductCreateDetailsHandlers, Props>(({ tr, productDetailsData, lang }, ref) => {
  const productDetailsFormValues = useProductsStore((state) => state.product_details_form_values)
  const { formShape, initialVals } = Products.buildProductDetailsWithoutVariationsFormFields(productDetailsData, tr, lang);

  const form = useForm({
    initialValues: initialVals,
    validateInputOnBlur: true,
    validate: yupResolver(formShape!),
  });

  useImperativeHandle((ref), () => ({
    getForm: () => form
  }))

  useEffect(() => {
    if (Object.keys(productDetailsFormValues).length > 0) form.setValues(productDetailsFormValues)
  }, [])

  const trans = productDetailsData.subcategory?.translations!;
  const attrs = productDetailsData.subcategory?.data!.attributes ?? {};

  return <>
    {Object.entries(attrs).map(([fieldName, fieldData]) => {
      return <ProductCreateDetailsInputWrapper
        key={fieldName}
        fieldData={fieldData}
        fieldName={fieldName}
        field={form.getInputProps(fieldName)}
        trans={trans}
      />
    })}
  </>
})

export default ProductCreateDetailsWithoutVariations
