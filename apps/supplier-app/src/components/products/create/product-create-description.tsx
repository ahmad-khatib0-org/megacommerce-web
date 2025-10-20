import { Button, Textarea, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { IconCircleX, IconPlus } from "@tabler/icons-react"
import {
  ObjString,
  PRODUCT_BULLET_POINT_MAX_LENGTH,
  PRODUCT_BULLET_POINT_MIN_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MIN_LENGTH
} from "@megacommerce/shared"

type Props = {
  tr: ObjString
  form: ProductCreateDescriptionForm
}

export type ProductCreateDescriptionForm = UseFormReturnType<ProductCreateDescriptionFormValues>

export interface ProductCreateDescriptionFormValues {
  description: string
  bullet_points: { id: string, bullet_point: string }[]
}

function ProductCreateDescription({ tr, form }: Props) {
  return (
    <div className='relative flex flex-col gap-y-4 w-full max-w-[800px]'>
      <Textarea
        label={tr.proDesc}
        placeholder={tr.proDesc}
        withAsterisk
        size="sm"
        rows={5}
        minLength={PRODUCT_DESCRIPTION_MIN_LENGTH}
        maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
        {...form.getInputProps('description')}
      />
      {form.getValues().bullet_points.map((bp, idx) => <div key={bp.id} className="flex flex-col">
        {idx !== 0 &&
          <div className='w-full flex justify-end mb-3'>
            <Button
              leftSection={<IconCircleX size={22} />}
              onClick={() => form.removeListItem('bullet_points', idx)}
              className='rounded-md'>
              {tr.bulletDel}
            </Button>
          </div>
        }
        <TextInput
          label={tr.bullet}
          placeholder={tr.bullet}
          withAsterisk
          size="md"
          minLength={PRODUCT_BULLET_POINT_MIN_LENGTH}
          maxLength={PRODUCT_BULLET_POINT_MAX_LENGTH}
          {...form.getInputProps(`bullet_points.${idx}.bullet_point`)}
        />
      </div>)}
      <div className="flex justify-end">
        <Button
          leftSection={<IconPlus />}
          onClick={() => form.insertListItem("bullet_points", { id: Date.now().toString(), bullet_point: '' })}
          className='bg-primary rounded-md w-max px-12'>
          {tr.addMore}
        </Button>
      </div>
    </div>
  )
}

export default ProductCreateDescription
