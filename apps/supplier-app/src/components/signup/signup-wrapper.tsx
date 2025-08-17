'use client'
import { useState } from 'react'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import Uppy from '@uppy/core'
import ImageEditor from '@uppy/image-editor'
import { toast } from 'react-toastify'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.min.css'

import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { Stepper } from '@megacommerce/ui/client'
import { ObjString, UserImageAcceptedTypes, UserImageMaxSizeKB } from '@megacommerce/shared'

import SignupInformationForm from '@/components/signup/signup-information-form'
import SignupAdditionalInfoForm from '@/components/signup/signup-additional-info-form'
import SignupAuthInfoForm, { PasswordRequirements } from '@/components/signup/signup-auth-info-form'
import { SignupHelpers } from '@/helpers/client'

type Props = {
  tr: ObjString
  passwordRequirements: PasswordRequirements
}

function SignupWrapper({ tr, passwordRequirements }: Props) {
  const [image, setImage] = useState<Attachment>()
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

  const [uppy] = useState(() => {
    return new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: UserImageMaxSizeKB,
        allowedFileTypes: UserImageAcceptedTypes,
      },
    }).use(ImageEditor, {
      quality: 0.9,
      cropperOptions: {
        viewMode: 1,
        aspectRatio: 1,
        zoomable: true,
        rotatable: true,
        scalable: true,
      },
    })
  })

  const steps = [
    <SignupInformationForm key="company" form={infoForm} tr={tr} />,
    <SignupAuthInfoForm key="auth" form={authForm} tr={tr} passwordRequirements={passwordRequirements} />,
    <SignupAdditionalInfoForm key="additional" tr={tr} uppy={uppy} setImg={setImage} />,
  ]

  const onClick = async (idx: number): Promise<boolean> => {
    let valid = false
    if (idx === 0) valid = !infoForm.validate().hasErrors
    else if (idx === 1) valid = !authForm.validate().hasErrors

    if (!valid) {
      toast.error(tr.correct)
      return false
    }
    return true
  }

  const onSubmit = async () => {
    console.log('called submit')
  }

  return (
    <Stepper
      subMsg={tr.createAcc}
      onSubmit={onSubmit}
      labels={[tr.s1Label, tr.s2Label, tr.s3Label]}
      steps={steps}
      clickNext={tr.clickNx}
      nextMsg={tr.next}
      prevMsg={tr.prev}
      onNext={(idx) => onClick(idx)}
      className="pe-4 min-h-[80vh]"
    />
  )
}

export default SignupWrapper
