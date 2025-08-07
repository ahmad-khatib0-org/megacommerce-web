import { UseFormReturnType } from '@mantine/form'

type Props = {
  form: SignupAuthInfoForm
}

export type SignupAuthInfoForm = UseFormReturnType<
  SignupAuthInfoFormValues,
  (v: SignupAuthInfoFormValues) => SignupAuthInfoFormValues
>

export interface SignupAuthInfoFormValues {
  email: string
  password: string
}

function SignupAuthInfoForm({ form }: Props) {
  return <div>signup auth info form</div>
}

export default SignupAuthInfoForm
