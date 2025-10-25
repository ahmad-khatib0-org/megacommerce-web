import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";

import { ObjString } from "@megacommerce/shared";

import ProductCreateDetailsInputString from "@/components/products/create/product-create-details-input-string";
import ProductCreateDetailsInputSelect from "@/components/products/create/product-create-details-input-select";
import ProductCreateDetailsInputCheckbox from "@/components/products/create/product-create-details-input-checkbox";
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

  const fields = productDetailsData.subcategory?.data!;
  const trans = productDetailsData.subcategory?.translations!;

  return (
    <div className="relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto">
      {Object.entries(fields.attributes).map(([fieldName, fieldData]) => {
        const type = fieldData.type;
        const label = trans.attributes[fieldName];
        const sharedProps = {
          key: fieldName,
          fieldData: fieldData,
          fieldName: fieldName,
          field: form.getInputProps(fieldName),
          label: label
        }
        if (type === "input") {
          return <ProductCreateDetailsInputString {...sharedProps} />
        } else if (type === "select") {
          return <ProductCreateDetailsInputSelect trans={trans} {...sharedProps} />
        } else if (type === "boolean") {
          return <ProductCreateDetailsInputCheckbox {...sharedProps} />
        }
        return null
      })}
    </div>
  );
})

export default ProductCreateDetails;

