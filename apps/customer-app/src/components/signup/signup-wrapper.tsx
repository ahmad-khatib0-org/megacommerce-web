'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.min.css'
import { Button, Stepper } from '@mantine/core'

import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { ObjString } from '@megacommerce/shared'
import { PageLoader } from '@megacommerce/ui/shared'

import SignupPersonalInfoForm from '@/components/signup/signup-personal-info-form'
import SignupAuthInfoForm, { PasswordRequirements } from '@/components/signup/signup-auth-info-form'
import SignupHooks from '@/components/signup/signup-hooks'
import { SignupHelpers } from '@/helpers/client'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
  passwordRequirements: PasswordRequirements
}

function SignupWrapper({ tr, passwordRequirements }: Props) {
  const router = useRouter()
  const clientInfo = useAppStore((state) => state.clientInitialInfo)
  const [image, setImage] = useState<Attachment>()
  const [imageErr, setImageErr] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const { personalForm, authForm, uppy, showSubmitButton, active, setActive, setShowSubmitButton } =
    SignupHooks({ tr, setImage })

  return (
    <div className='grid grid-rows-[1fr,auto] bg-slate-100/90 h-full'>
      {submitting && <PageLoader />}
      <Stepper
        active={active}
        onStepClick={setActive}
        // allowNextStepsSelect={false}
        className='bg-white'
        styles={{
          root: { width: '100%', display: 'flex', flexDirection: 'column' },
          separator: { display: 'none' },
          step: { display: 'felx', flexDirection: 'column', rowGap: '1rem' },
          steps: { marginTop: '1rem', justifyContent: 'space-evenly', width: '100%' },
          content: { display: 'flex', justifyContent: 'center', padding: '2rem 0px' },
        }}>
        <Stepper.Step label={tr.s1Label} aria-label={tr.s1Label}>
          <SignupPersonalInfoForm form={personalForm} tr={tr} imgErr={imageErr} uppy={uppy} />,
        </Stepper.Step>
        <Stepper.Step label={tr.s2Label} aria-label={tr.s2Label}>
          <SignupAuthInfoForm form={authForm} tr={tr} passwordRequirements={passwordRequirements} />
        </Stepper.Step>
      </Stepper>
      <div className='flex items-center justify-between px-12 border-t py-4'>
        <Button>{tr.cancel}</Button>
        <div className='flex items-center gap-x-4'>
          <Button onClick={() => SignupHelpers.onClickPrev(active, setActive)} variant='default'>
            {tr.prev}
          </Button>
          {showSubmitButton && (
            <Button
              onClick={async () =>
                await SignupHelpers.onSubmit(
                  clientInfo.language,
                  submitting,
                  setSubmitting,
                  personalForm,
                  authForm,
                  image,
                  setImageErr,
                  router,
                  setActive
                )
              }>
              {tr.createAcc}
            </Button>
          )}
          {!showSubmitButton && (
            <Button
              onClick={async () =>
                SignupHelpers.onClickNext(active, setActive, setShowSubmitButton, tr, personalForm, authForm)
              }>
              {tr.next}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignupWrapper
