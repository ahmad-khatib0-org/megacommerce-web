import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";

import { ObjString } from "@megacommerce/shared";

import ProductCreateDetailsInputWrapper from "@/components/products/create/product-create-details-input-wrapper";
import { useAppStore, useProductsStore } from "@/store";
import { Products } from "@/helpers/client";

type Props = {
  tr: ObjString;
  hasVariations: boolean
};

export type ProductCreateDetailsHandlers = {
  getForm: () => UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>
}

// TODO: complete the regex field type and validation
const ProductCreateDetails = forwardRef<ProductCreateDetailsHandlers, Props>(({ tr, hasVariations }, ref) => {
  const productDetailsData = useProductsStore((state) => state.product_details_data);
  const productDetailsFormValues = useProductsStore((state) => state.product_details_form_values)
  const lang = useAppStore((state) => state.clientInfo.language);

  if (!productDetailsData) return null;

  const { formShape, initialVals } = Products.buildProductDetailsFormFields(productDetailsData, tr, lang);

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

  const { trans, fieldsShared, fieldsVariations } = Products.buildProductDetailsFormFieldsVariations(productDetailsData, hasVariations)

  return (
    <div className="relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto">
      {Object.entries(fieldsVariations).map(([fieldName, fieldData]) => {
        return <ProductCreateDetailsInputWrapper
          key={fieldName}
          fieldData={fieldData}
          fieldName={fieldName}
          field={form.getInputProps(fieldName)}
          trans={trans} />
      })}
    </div>
  );
})

export default ProductCreateDetails;

