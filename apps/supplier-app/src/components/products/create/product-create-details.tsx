import { number, object, string, boolean as booleanSchema } from "yup";
import { Checkbox, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";

import { ProductDataResponseData } from "@megacommerce/proto/web/products/v1/product_data";
import { NumericRuleType, StringRuleType } from "@megacommerce/proto/web/shared/v1/validation";
import { ObjString, ValueLabel } from "@megacommerce/shared";
import { tr as translator } from '@megacommerce/shared/client';
import { useAppStore, useProductsStore } from "@/store";

type Props = {
  tr: ObjString;
};

// TODO: complete the regex field type and validation
function ProductCreateDetails({ tr }: Props) {
  const productDetailsData = useProductsStore((s) => s.product_details_data);
  const lang = useAppStore((s) => s.clientInfo.language);

  if (!productDetailsData) return null;

  const buildFormFields = (fields: ProductDataResponseData) => {
    const formFields: { [key: string]: any } = {};
    const initialVals: Record<string, any> = {};

    const data = fields.subcategory?.data;
    const trans = fields.subcategory?.translations;
    if (!data || !trans) return { formFields, initialVals, formShape: undefined };

    for (const [fieldName, fieldData] of Object.entries(data.attributes)) {
      if (fieldData.type === "input") {
        initialVals[fieldName] = "";
        const str = fieldData.validation?.str;
        const num = fieldData.validation?.numeric;
        const required = fieldData.required;

        if (str) {
          let schema = required ? string().required(tr.required) : string();
          for (const rule of str.rules) {
            if (rule.type === StringRuleType.STRING_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min_length', { Min: rule.value }));
            } else if (rule.type === StringRuleType.STRING_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max_length', { Max: rule.value }));
            }
          }
          formFields[fieldName] = schema;
        } else if (num) {
          let schema = required ? number().required(tr.required).typeError(tr.invNum) : number().typeError(tr.invNum);
          for (const rule of num.rules) {
            if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MIN) {
              schema = schema.min(rule.value, translator(lang, 'form.fields.min', { Min: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_MAX) {
              schema = schema.max(rule.value, translator(lang, 'form.fields.max', { Max: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_GT) {
              schema = schema.moreThan(rule.value, translator(lang, 'form.fields.greater_than', { Max: rule.value }));
            }
            else if (rule.type === NumericRuleType.NUMERIC_RULE_TYPE_LT) {
              schema = schema.lessThan(rule.value, translator(lang, 'form.fields.less_than', { Min: rule.value }));
            }
          }
          formFields[fieldName] = schema;
        }

      } else if (fieldData.type === "select") {
        initialVals[fieldName] = "";
        let schema = fieldData.required ? string().required(tr.required) : string();
        schema = schema.oneOf(fieldData.stringArray, tr.invInp);
        formFields[fieldName] = schema;

      } else if (fieldData.type === "boolean") {
        initialVals[fieldName] = false;
        formFields[fieldName] = booleanSchema()
      }
    }

    const formShape = object().shape(formFields);
    return { formShape, initialVals };
  };

  const { formShape, initialVals } = buildFormFields(productDetailsData);

  const form = useForm({
    initialValues: initialVals,
    validateInputOnBlur: true,
    validate: yupResolver(formShape!),
  });

  const fields = productDetailsData.subcategory?.data!;
  const trans = productDetailsData.subcategory?.translations!;

  return (
    <div className="relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto">
      {Object.entries(fields.attributes).map(([fieldName, fieldData]) => {
        const type = fieldData.type;
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
}

export default ProductCreateDetails;

