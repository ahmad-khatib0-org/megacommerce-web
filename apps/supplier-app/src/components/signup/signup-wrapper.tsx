'use client'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'

import { Stepper } from '@megacommerce/ui'
import type { ObjString } from '@megacommerce/shared'

import SignupInformationForm from '@/components/signup/signup-information-form'

type Props = {
  trans: ObjString
}

function SignupWrapper({ trans }: Props) {
  const infoForm = useForm({
    validateInputOnBlur: true,
  })

  const steps = [
    <SignupInformationForm key="information" form={} />,
    <div key="second"> second </div>,
    <div key="third"> third </div>,
  ]

  return (
    <section className="">
      <Stepper
        labels={['item 1', 'item 21', 'item 3']}
        steps={steps}
        clickNext="please click the next button instead"
        nextMsg="Next"
        prevMsg="Previous"
      />
    </section>
  )
}

export default SignupWrapper
