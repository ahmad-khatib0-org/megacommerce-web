'use client'
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { IconMail, IconLock } from "@tabler/icons-react"

import { ObjString, UserPasswordMaxLength, UserPasswordMinLength } from "@megacommerce/shared"
import { PageLoader } from "@megacommerce/ui/shared"
import LoginHooks from "@/components/auth/login/login-hooks"

type Props = {
  tr: ObjString
}

const LoginWrapper = ({ tr }: Props) => {
  const { loading, form, onSubmit } = LoginHooks({ tr })

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
          type="email"
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
          leftSection={<IconLock size={20} />}
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
