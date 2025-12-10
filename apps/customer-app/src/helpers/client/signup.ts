import 'client-only'
import { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { object, string, ref } from 'yup'

import { CustomerCreateRequest } from '@megacommerce/proto/web/users/v1/customer'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { AppError } from '@megacommerce/proto/shared/v1/error'
import { getFirstErroredStep, handleGrpcWebErr } from '@megacommerce/shared/client'
import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserPasswordMaxLength,
  UserPasswordMinLength,
  UserNameMaxLength,
  UserNameMinLength,
  UserNameRegex,
} from '@megacommerce/shared'

import { SignupAuthInfoForm } from '@/components/signup/signup-auth-info-form'
import { SignupPersonalInfoForm } from '@/components/signup/signup-personal-info-form'
import { usersClient } from '@/helpers/client'

export class SignupHelpers {
  static onClickNext = async (
    active: number,
    setActive: Dispatch<SetStateAction<number>>,
    setShowSubmitButton: Dispatch<SetStateAction<boolean>>,
    tr: ObjString,
    personal: SignupPersonalInfoForm,
    auth: SignupAuthInfoForm
  ) => {
    let valid = false
    if (active === 0) valid = !personal.validate().hasErrors
    else if (active === 1) valid = !auth.validate().hasErrors

    if (!valid) {
      toast.error(tr.correct)
      return false
    }
    if (active == 0) setActive((current) => current + 1)
    else setShowSubmitButton(true)
  }

  static onClickPrev = (active: number, setActive: Dispatch<SetStateAction<number>>) => {
    if (active === 0) return
    setActive((current) => (current > 0 ? current - 1 : current))
  }

  static onSubmit = async (
    lang: string,
    sub: boolean,
    setSub: Dispatch<SetStateAction<boolean>>,
    personal: SignupPersonalInfoForm,
    auth: SignupAuthInfoForm,
    image: Attachment | undefined,
    setImgErr: Dispatch<SetStateAction<string | undefined>>,
    router: ReturnType<typeof useRouter>,
    updateStep: ((idx: number) => void) | undefined
  ) => {
    if (sub) return
    setSub(true)
    try {
      const req = this.requestBuilder(personal.values, auth.values, image)
      const res = await (await usersClient()).CreateCustomer(req)
      if (res.error) {
        this.invalidateForms(res.error, personal, auth, setImgErr)
        const firstErr = getFirstErroredStep(res.error!.errors!, this.formStepsFields())
        if (updateStep && firstErr !== -1) updateStep(firstErr)
        return
      }
      toast.success(res.data!.message, { delay: 7000 })
      router.replace('/')
    } catch (err) {
      toast.error(handleGrpcWebErr(err, lang))
    } finally {
      setSub(false)
    }
  }

  static formStepsFields() {
    return { 0: Object.keys(this.personalInfoFormValues()), 1: Object.keys(this.authInfoFormValues()) }
  }

  static personalInfoForm(tr: ObjString) {
    return object().shape({
      username: string()
        .matches(UserNameRegex, tr.unValErr)
        .min(UserNameMinLength, tr.unLenErr)
        .max(UserNameMaxLength, tr.unLenErr)
        .required(tr.unLenErr),
      first_name: string().min(UserFirstNameMinLength).max(UserFirstNameMaxLength).required(tr.fnErr),
      last_name: string().min(UserLastNameMinLength).max(UserLastNameMaxLength).required(tr.lnErr),
    })
  }

  static personalInfoFormValues() {
    return { username: '', first_name: '', last_name: '' }
  }

  static authInfoFormValues() {
    return { email: '', password: '', password_confirmation: '' }
  }

  static authInfoForm(tr: ObjString) {
    return object().shape({
      email: string().email().required(tr.emailErr),
      password: string()
        .min(UserPasswordMinLength, tr.passMinErr)
        .max(UserPasswordMaxLength, tr.passMaxErr)
        .required(tr.r),
      password_confirmation: string()
        .oneOf([ref('password')], tr.passConfErr)
        .required(tr.r),
    })
  }

  static requestBuilder(
    personal: ReturnType<typeof this.personalInfoFormValues>,
    auth: ReturnType<typeof this.authInfoFormValues>,
    image: Attachment | undefined
  ) {
    const req: CustomerCreateRequest = {
      username: personal.username,
      firstName: personal.first_name,
      lastName: personal.last_name,
      email: auth.email,
      password: auth.password,
      image,
    }
    return req
  }

  static invalidateForms(
    error: AppError,
    personal: SignupPersonalInfoForm,
    auth: SignupAuthInfoForm,
    setImgErr: Dispatch<SetStateAction<string | undefined>>
  ) {
    const e = error.errors?.values
    if (!e) return
    if (e.hasOwnProperty('username')) personal.setFieldError('username', e['username'])
    if (e.hasOwnProperty('first_name')) personal.setFieldError('first_name', e['first_name'])
    if (e.hasOwnProperty('last_name')) personal.setFieldError('last_name', e['last_name'])
    if (e.hasOwnProperty('email')) auth.setFieldError('email', e['email'])
    if (e.hasOwnProperty('password')) auth.setFieldError('password', e['password'])
    if (e.hasOwnProperty('image')) setImgErr(e['image'])
  }
}
