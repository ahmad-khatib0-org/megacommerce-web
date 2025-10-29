'use client'
import { ReactNode, useState } from 'react'
import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import { object, string } from 'yup'
import { toast } from 'react-toastify'
import { IconMail } from '@tabler/icons-react'

import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { PageLoader, SuccessMessage } from '@megacommerce/ui/shared'
import { ObjString } from '@megacommerce/shared'
import { PagesPaths, usersClient } from '@/helpers/client'

type Props = {
  Header: ReactNode
  BackButton: ReactNode
  tr: ObjString
}

function PasswordForgotWrapper({ tr, BackButton, Header }: Props) {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<{ message: string; description: string } | undefined>()

  const form = useForm({
    initialValues: { email: '' },
    validateInputOnBlur: true,
    validate: yupResolver(object().shape({ email: string().email().required(tr.emailErr) })),
  })

  const onSubmit = async ({ email }: { email: string }) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await usersClient.PasswordForgot({ email })
      if (res.error) {
        toast.error(res.error.message)
        return
      }
      setSuccessMsg({
        message: res.data?.message ?? '',
        description: res.data?.metadata['description'] ?? '',
      })
    } catch (err) {
      toast.error(handleGrpcWebErr(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <PageLoader />}
      {!successMsg && (
        <form
          onSubmit={form.onSubmit(async (values) => await onSubmit(values))}
          className='max-w-[700px] w-full h-full flex flex-col justify-center gap-y-8 border border-dashed border-slate-400 p-12'>
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
          <div className='flex justify-between items-center mt-16'>
            {BackButton}
            <Button type='submit' className='bg-blue-500 text-white font-bold text-xl' title={tr.send}>
              {tr.send}
            </Button>
          </div>
        </form>
      )}
      {successMsg && (
        <SuccessMessage
          title={successMsg.message}
          subtitle={successMsg.description}
          goToMsg={tr.goToMsg}
          goToLink={PagesPaths.login}
        />
      )}
    </>
  )
}

export default PasswordForgotWrapper
