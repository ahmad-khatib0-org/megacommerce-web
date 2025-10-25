import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Checkbox, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";

import { StringRuleType } from "@megacommerce/proto/web/shared/v1/validation";
import { ObjString, ValueLabel } from "@megacommerce/shared";
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
        const customizable = fieldData.includeInVariants;
        const required = fieldData.required;
        const label = trans.attributes[fieldName];

        if (type === "input") {
          const str = fieldData.validation?.str;
          const num = fieldData.validation?.numeric;
          const regex = fieldData.validation?.regex

          if (str) {
            let minLength = 0;
            let maxLength = 0;
            for (const rule of str.rules) {
              if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) minLength = rule.value;
              else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) maxLength = rule.value;
            }

            return (
              <TextInput
                key={fieldName}
                label={label}
                placeholder={label}
                aria-label={label}
                withAsterisk
                size="sm"
                minLength={minLength}
                maxLength={maxLength}
                {...form.getInputProps(fieldName)}
              />
            );
          } else if (num) {
            return (
              <NumberInput
                key={fieldName}
                label={label}
                placeholder={label}
                aria-label={label}
                withAsterisk
                size="sm"
                {...form.getInputProps(fieldName)}
              />
            );
          }
        } else if (type === "select") {
          const selectData: ValueLabel[] = Object
            .entries(trans.data[fieldName].values)
            .map(([label, value]) => ({ label, value, }));
          return (
            <Select
              key={fieldName}
              label={label}
              placeholder={label}
              aria-label={label}
              data={selectData}
              allowDeselect={!required}
              withAsterisk
              size="sm"
              {...form.getInputProps(fieldName)}
            />
          );
        } else if (type === "boolean") {
          return (
            <Checkbox
              key={fieldName}
              label={label}
              aria-label={label}
              className="font-medium mt-4"
              styles={{ label: { fontSize: 16 } }}
              {...form.getInputProps(fieldName)}
            />
          );
        }
        return null
      })}
    </div>
  );
})

export default ProductCreateDetails;

