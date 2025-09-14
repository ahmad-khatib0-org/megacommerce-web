'use client'
import { useEffect, useState } from "react"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useForm } from "@mantine/form"
import { object, string } from "yup"
import { toast } from "react-toastify"
import { yupResolver } from "mantine-form-yup-resolver"
import { IconMail } from "@tabler/icons-react"

import { PageLoader } from "@megacommerce/ui/shared"
import { handleGrpcWebErr } from "@megacommerce/shared/client"
import { ObjString, UserPasswordMaxLength, UserPasswordMinLength } from "@megacommerce/shared"
import { LoginHelpers } from "@/helpers/client"

type Props = {
  tr: ObjString
}

const LoginWrapper = ({ tr }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<{ message: string, description: string } | undefined>()

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: { email: '', password: '' },
    validate: yupResolver(object().shape({
      email: string().email().required(tr.emailErr),
      password: string()
        .min(UserPasswordMinLength, tr.passMinErr)
        .max(UserPasswordMaxLength, tr.passMaxErr)
        .required(tr.r),
    }))
  })

  const onSubmit = async ({ email, password }: { email: string, password: string }) => {
    if (loading) return
    setLoading(true)
    try {
    } catch (err) {
      toast.error(handleGrpcWebErr(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const url = LoginHelpers.checkLoginUrl(window.location.href)
    if (url) router.push(url.toString())
  }, [])

  return (
    <div>
      {loading && <PageLoader />}
      <form
        onSubmit={form.onSubmit(async (values) => await onSubmit(values))}
        className="w-full h-full flex flex-col justify-center gap-y-8 p-12"
      >
        <h1 className="font-bold text-4xl text-blue-950">Welcome Back!</h1>
        <TextInput
          label={tr.email}
          placeholder={tr.email}
          withAsterisk
          size='sm'
          className="w-96"
          leftSection={<IconMail size={20} />}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label={tr.email}
          placeholder={tr.email}
          withAsterisk
          size='sm'
          className="w-96"
          maxLength={UserPasswordMaxLength}
          minLength={UserPasswordMinLength}
          leftSection={<IconMail size={20} />}
          {...form.getInputProps('password')}
        />
        <div className="flex justify-between items-center mt-8">
          <Button type="submit" className="bg-blue-950 hover:bg-blue-900 px-12 text-white font-bold text-xl" title={tr.send} >
            {tr.login}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginWrapper 
