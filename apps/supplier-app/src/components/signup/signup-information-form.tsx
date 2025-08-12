import { TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

import { ObjString } from '@megacommerce/shared'

type Props = {
  form: SignupInformationForm
  tr: ObjString
}

export type SignupInformationForm = UseFormReturnType<
  SignupInformationFormValues,
  (v: SignupInformationFormValues) => SignupInformationFormValues
>

export interface SignupInformationFormValues {
  username: string
  first_name: string
  last_name: string
}

function SignupInformationForm({ form, tr }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 max-w-[700px]">
      <TextInput
        label={tr.un}
        placeholder={tr.un}
        withAsterisk
        size="sm"
        className="mb-3"
        {...form.getInputProps('username')}
      />
      <TextInput
        label={tr.fn}
        placeholder={tr.fn}
        withAsterisk
        size="sm"
        className="mb-3"
        {...form.getInputProps('first_name')}
      />
      <TextInput
        label={tr.ln}
        placeholder={tr.ln}
        withAsterisk
        size="sm"
        className="mb-3"
        {...form.getInputProps('last_name')}
      />
    </div>
  )
}

export default SignupInformationForm
