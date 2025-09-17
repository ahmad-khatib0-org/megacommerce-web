import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@mantine/form"
import { object, string } from "yup"
import { toast } from "react-toastify"
import { yupResolver } from "mantine-form-yup-resolver"

import { AppError } from "@megacommerce/proto/shared/v1/error"
import { SuccessResponseData } from "@megacommerce/proto/shared/v1/types"
import { ObjString, UserPasswordMaxLength, UserPasswordMinLength } from "@megacommerce/shared"
import { handleGrpcWebErr } from "@megacommerce/shared/client"
import { LoginHelpers, PagesPaths, usersClient } from "@/helpers/client"

type Props = {
  tr: ObjString
}

function LoginHooks({ tr }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [challenge, setChallenge] = useState("")

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
      const res = await usersClient.Login({ email, password, loginChallenge: challenge })
      if (res.error) handleError(res.error)
      if (res.data) handleSuccess(res.data)
    } catch (err) {
      toast.error(handleGrpcWebErr(err))
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: AppError) => {
    const errors = error.errors
    if (errors) {
      const e = errors.data
      if (e['error']) {
        const url = `${PagesPaths.loginError}?error=${e['error']}&error_description=${e['error_description']}`
        router.replace(url)
        return
      }
      if (e['email']) form.setFieldError("email", e['email'])
      if (e['password']) form.setFieldError("password", e['password'])
      if (error.message) toast.error(error.message)
    }
  }

  const handleSuccess = (data: SuccessResponseData) => {
    const url = data.metadata['redirect_to']
    if (url) router.push(url)
  }

  // TODO: handle no challenge and display an error popup
  const init = () => {
    const location = window.location.href
    const url = LoginHelpers.checkLoginUrl(location)
    if (url) {
      router.push(url.toString())
      return
    }
    setChallenge(() => LoginHelpers.getLoginChallengeParam(location))
  }

  useEffect(() => {
    init()
  }, [])

  return {
    router, loading, form, setLoading, onSubmit,
  }
}

export default LoginHooks
