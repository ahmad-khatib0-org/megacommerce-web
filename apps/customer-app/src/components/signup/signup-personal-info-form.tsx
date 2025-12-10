import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import { TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

import { ObjString } from '@megacommerce/shared'

type Props = {
  form: SignupPersonalInfoForm
  tr: ObjString
  imgErr?: string
  uppy: Uppy
}

export type SignupPersonalInfoForm = UseFormReturnType<
  SignupPersonalInfoFormValues,
  (v: SignupPersonalInfoFormValues) => SignupPersonalInfoFormValues
>

export interface SignupPersonalInfoFormValues {
  username: string
  first_name: string
  last_name: string
}

function SignupPersonalInfoForm({ form, tr, imgErr, uppy }: Props) {
  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-2 gap-x-6 gap-y-8 max-w-[800px] w-[750px]'>
        <TextInput
          label={tr.un}
          placeholder={tr.un}
          withAsterisk
          size='sm'
          className='mb-3'
          {...form.getInputProps('username')}
        />
        <TextInput
          label={tr.fn}
          placeholder={tr.fn}
          withAsterisk
          size='sm'
          className='mb-3'
          {...form.getInputProps('first_name')}
        />
        <TextInput
          label={tr.ln}
          placeholder={tr.ln}
          withAsterisk
          size='sm'
          className='mb-3 self-center'
          {...form.getInputProps('last_name')}
        />
      </div>
      <div className='flex flex-col col-span-full w-full'>
        <p className='font-medium text-center my-4 tx-primary text-lg'>
          {tr.profileImg} ({tr.optionaImg})
        </p>
        {imgErr && <p className='block font-medium text-center my-3 text-red-500 text-lg'>{imgErr}</p>}
        <Dashboard
          uppy={uppy}
          height={300}
          width='100%'
          proudlyDisplayPoweredByUppy={false}
          note={tr.maxImgSz}
          hideUploadButton={true}
          showProgressDetails={true}
          locale={{
            strings: {
              browseFiles: 'select from device',
            },
          }}
        />
      </div>
    </div>
  )
}

export default SignupPersonalInfoForm
