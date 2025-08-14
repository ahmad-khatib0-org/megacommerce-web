'use client'
import { useState } from 'react'
import { FilePondFile } from 'filepond'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'

import { Stepper } from '@megacommerce/ui/client'
import { ObjString } from '@megacommerce/shared'

import SignupInformationForm from '@/components/signup/signup-information-form'
import SignupAdditionalInfoForm from '@/components/signup/signup-additional-info-form'
import SignupAuthInfoForm, { PasswordRequirements } from '@/components/signup/signup-auth-info-form'
import { SignupHelpers } from '@/helpers/client'

type Props = {
  tr: ObjString
  passwordRequirements: PasswordRequirements
}

function SignupWrapper({ tr, passwordRequirements }: Props) {
  const [image, setImage] = useState<FilePondFile[]>([])
  const infoForm = useForm({
    validateInputOnBlur: true,
    validate: yupResolver(SignupHelpers.infoForm(tr)),
    initialValues: SignupHelpers.infoFormValues(),
  })

  const authForm = useForm({
    validateInputOnBlur: true,
    validate: yupResolver(SignupHelpers.authInfoForm(tr)),
    initialValues: SignupHelpers.authInfoFormValues(),
  })

  const steps = [
    <SignupInformationForm key="company" form={infoForm} tr={tr} />,
    <SignupAuthInfoForm key="auth" form={authForm} tr={tr} passwordRequirements={passwordRequirements} />,
    <SignupAdditionalInfoForm key="additional" tr={tr} image={image} setImg={setImage} />,
  ]

  const onClick = async (idx: number): Promise<boolean> => {
    await new Promise((res) => setTimeout(() => res(''), 1000))
    console.log(idx)
    return true
  }

  return (
    <Stepper
      labels={[tr.s1Label, tr.s2Label, tr.s3Label]}
      steps={steps}
      clickNext={tr.clickNx}
      nextMsg="Next"
      prevMsg="Previous"
      className="pe-4 min-h-[350px]"
      onNext={(idx) => onClick(idx)}
    />
  )
}

export default SignupWrapper
