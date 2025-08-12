'use client'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'

import { Stepper } from '@megacommerce/ui'
import { ObjString } from '@megacommerce/shared'

import SignupInformationForm from '@/components/signup/signup-information-form'
import { SignupHelpers } from '@/helpers/client'

type Props = {
  tr: ObjString
}

function SignupWrapper({ tr }: Props) {
  const infoForm = useForm({
    validateInputOnBlur: true,
    validate: yupResolver(SignupHelpers.infoForm(tr)),
    initialValues: SignupHelpers.infoFormValues(),
  })

  const steps = [
    <SignupInformationForm key="company" form={infoForm} tr={tr} />,
    <div key="auth"> second </div>,
    <div key="addetiona"> third </div>,
  ]

  return (
    <Stepper
      labels={[tr.s1Label, tr.s2Label, tr.s3Label]}
      steps={steps}
      clickNext={tr.clickNx}
      nextMsg="Next"
      prevMsg="Previous"
      className="pe-4"
    />
  )
}

export default SignupWrapper
