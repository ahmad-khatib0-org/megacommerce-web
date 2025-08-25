import 'client-only'
import { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { object, string, ref } from 'yup'
import { SupplierCreateRequest } from '@megacommerce/proto/web/users/v1/supplier'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { AppError } from '@megacommerce/proto/shared/v1/error'
import { getFirstErroredStep, handleGrpcWebErr } from '@megacommerce/shared/client'
import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserNameMaxLength,
  UserNameMinLength,
  UserPasswordMaxLength,
  UserPasswordMinLength,
  UserNameRegex,
} from '@megacommerce/shared'

import { SignupAuthInfoForm } from '@/components/signup/signup-auth-info-form'
import { SignupInformationForm } from '@/components/signup/signup-information-form'
import { PagesPaths, usersClient } from '@/helpers/client'

export class SignupHelpers {
  static onClickNext = async (
    idx: number,
    tr: ObjString,
    info: SignupInformationForm,
    auth: SignupAuthInfoForm,
  ): Promise<boolean> => {
    let valid = false
    if (idx === 0) valid = !info.validate().hasErrors
    else if (idx === 1) valid = !auth.validate().hasErrors

    if (!valid) {
      toast.error(tr.correct)
      return false
    }
    return true
  }

  static onSubmit = async (
    sub: boolean,
    setSub: Dispatch<SetStateAction<boolean>>,
    info: SignupInformationForm,
    auth: SignupAuthInfoForm,
    image: Attachment | undefined,
    setImgErr: Dispatch<SetStateAction<string | undefined>>,
    router: ReturnType<typeof useRouter>,
    updateStep: ((idx: number) => void) | undefined,
  ) => {
    if (sub) return
    setSub(true)
    try {
      const req = this.requestBuilder(info.values, auth.values, image)
      const res = await usersClient.CreateSupplier(req)
      if (res.error) {
        console.log(res.error)
        this.invalidateForms(res.error, info, auth, setImgErr)
        const firstErr = getFirstErroredStep(res.error!.errors!, this.formStepsFields())
        if (updateStep && firstErr !== -1) updateStep(firstErr)
        return
      }
      toast.success(res.data!.message, { delay: 7000 })
      router.replace(PagesPaths.home)
    } catch (err) {
      toast.error(handleGrpcWebErr(err))
    } finally {
      setSub(false)
    }
  }

  static formStepsFields() {
    return { 0: Object.keys(this.infoFormValues()), 1: Object.keys(this.authInfoFormValues()), 2: ['image'] }
  }

  static infoForm(tr: ObjString) {
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

  static infoFormValues() {
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
    info: ReturnType<typeof this.infoFormValues>,
    auth: ReturnType<typeof this.authInfoFormValues>,
    image: Attachment | undefined,
  ) {
    const req: SupplierCreateRequest = {
      username: info.username,
      firstName: info.first_name,
      lastName: info.last_name,
      email: auth.email,
      password: auth.password,
      membership: '',
      image,
    }
    return req
  }

  static invalidateForms(
    error: AppError,
    info: SignupInformationForm,
    auth: SignupAuthInfoForm,
    setImgErr: Dispatch<SetStateAction<string | undefined>>,
  ) {
    const e = error.errors?.data
    if (!e) return
    if (e.hasOwnProperty('username')) info.setFieldError('username', e['username'])
    if (e.hasOwnProperty('first_name')) info.setFieldError('first_name', e['first_name'])
    if (e.hasOwnProperty('last_name')) info.setFieldError('last_name', e['last_name'])
    if (e.hasOwnProperty('email')) auth.setFieldError('email', e['email'])
    if (e.hasOwnProperty('password')) auth.setFieldError('password', e['password'])
    if (e.hasOwnProperty('image')) setImgErr(e['image'])
  }
}
