import { TextInput, PasswordInput as PassInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

import { PasswordInput } from '@megacommerce/ui/client'
import { ObjString, UserPasswordMaxLength, UserPasswordMinLength } from '@megacommerce/shared'

type Props = {
  form: SignupAuthInfoForm
  passwordRequirements: PasswordRequirements
  tr: ObjString
}

export type PasswordRequirements = { re: string; label: string }[]

export type SignupAuthInfoForm = UseFormReturnType<
  SignupAuthInfoFormValues,
  (v: SignupAuthInfoFormValues) => SignupAuthInfoFormValues
>

export interface SignupAuthInfoFormValues {
  email: string
  password: string
  password_confirmation: string
}

function SignupAuthInfoForm({ form, tr, passwordRequirements }: Props) {
  return (
    <div className='grid grid-cols-2 gap-x-6 gap-y-8 max-w-[700px]'>
      <TextInput
        type='email'
        label={tr.email}
        placeholder={tr.email}
        withAsterisk
        maxLength={240}
        size='sm'
        {...form.getInputProps('email')}
      />
      <PasswordInput<SignupAuthInfoFormValues>
        fieldName='password'
        requirements={passwordRequirements}
        minLength={UserPasswordMinLength}
        maxLength={UserPasswordMaxLength}
        label={tr.pass}
        placeholder={tr.pass}
        passAtLeast={tr.passMinErr}
        form={form}
      />
      <PassInput
        label={tr.passConf}
        placeholder={tr.passConf}
        withAsterisk
        {...form.getInputProps('password_confirmation')}
      />
    </div>
  )
}

export default SignupAuthInfoForm
