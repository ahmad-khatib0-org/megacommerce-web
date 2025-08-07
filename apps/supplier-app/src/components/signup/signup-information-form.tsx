import { UseFormReturnType } from '@mantine/form'

type Props = {
  form: SignupInformationForm
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

function SignupInformationForm({ form }: Props) {
  return <div>signup information form</div>
}

export default SignupInformationForm
