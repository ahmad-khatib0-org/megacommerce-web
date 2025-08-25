'use client'
import { ReactNode } from "react"
import { useForm } from '@mantine/form'
import { object, string } from 'yup'
import { yupResolver } from 'mantine-form-yup-resolver'
import { IconMail } from '@tabler/icons-react'

import { ObjString } from "@megacommerce/shared"
import { Button, TextInput } from "@mantine/core"

type Props = {
  Header: ReactNode,
  BackButton: ReactNode,
  tr: ObjString
}

function ForgotPasswordWrapper({ tr, BackButton, Header }: Props) {
  const form = useForm({
    initialValues: { email: '' },
    validateInputOnBlur: true,
    validate: yupResolver(object().shape({ email: string().email().required(tr.emailErr) }))
  })

  const onSubmit = async ({ email }: { email: string }) => {
    console.log(email);
  }

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} className="max-w-[700px] w-full h-full flex flex-col justify-center gap-y-8 border border-dashed border-slate-400 p-12">
      {Header}
      <TextInput
        label={tr.email}
        placeholder={tr.email}
        className='mt-2 max-w-[70%]'
        withAsterisk
        size='md'
        leftSection={<IconMail size={20} />}
        {...form.getInputProps('email')}
      />
      <div className="flex justify-between items-center mt-16">
        {BackButton}
        <Button type="submit" className="bg-blue-500 text-white font-bold text-xl" title={tr.send} >
          {tr.send}
        </Button>
      </div>
    </form>
  )
}

export default ForgotPasswordWrapper
