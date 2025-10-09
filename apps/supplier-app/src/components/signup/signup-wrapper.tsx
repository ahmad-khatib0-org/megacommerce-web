'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.min.css'

import { ObjString } from '@megacommerce/shared'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { PageLoader } from '@megacommerce/ui/shared'
import { Stepper, StepperHandle } from '@megacommerce/ui/client'

import SignupInformationForm from '@/components/signup/signup-information-form'
import SignupAdditionalInfoForm from '@/components/signup/signup-additional-info-form'
import SignupAuthInfoForm, { PasswordRequirements } from '@/components/signup/signup-auth-info-form'
import SignupHooks from '@/components/signup/signup-hooks'
import { SignupHelpers } from '@/helpers/client'

type Props = {
  tr: ObjString
  passwordRequirements: PasswordRequirements
}

function SignupWrapper({ tr, passwordRequirements }: Props) {
  const stepperRef = useRef<StepperHandle>(null)
  const [image, setImage] = useState<Attachment>()
  const [imageErr, setImageErr] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const { uppy, infoForm, authForm } = SignupHooks({ tr, setImage })
  const router = useRouter()

  const steps = [
    <SignupInformationForm key="company" form={infoForm} tr={tr} />,
    <SignupAuthInfoForm key="auth" form={authForm} tr={tr} passwordRequirements={passwordRequirements} />,
    <SignupAdditionalInfoForm key="additional" tr={tr} uppy={uppy} errMsg={imageErr} />,
  ]

  return (
    <>
      {submitting && <PageLoader />}
      <Stepper
        ref={stepperRef}
        subMsg={tr.createAcc}
        onSubmit={async () =>
          await SignupHelpers.onSubmit(
            submitting,
            setSubmitting,
            infoForm,
            authForm,
            image,
            setImageErr,
            router,
            stepperRef.current?.updateStep,
          )
        }
        labels={[tr.s1Label, tr.s2Label, tr.s3Label]}
        steps={steps}
        clickNext={tr.clickNx}
        nextMsg={tr.next}
        prevMsg={tr.prev}
        onNext={(idx) => SignupHelpers.onClickNext(idx, tr, infoForm, authForm)}
        className="pe-4 min-h-[80vh]"
      />
    </>
  )
}

export default SignupWrapper
