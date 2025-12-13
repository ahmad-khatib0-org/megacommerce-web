import 'server-only'
import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserPasswordMaxLength,
  UserPasswordMinLength,
} from '@megacommerce/shared'
import { Cookies, Trans } from '@megacommerce/shared/server'
import { UserNameMaxLength, UserNameMinLength } from '@megacommerce/shared'

export async function getPasswordRequirements() {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  return [
    { re: '[0-9]', label: tr(lang, 'password.numbers') },
    { re: '[a-z]', label: tr(lang, 'password.lowercase') },
    { re: '[A-Z]', label: tr(lang, 'password.uppercase') },
    { re: "[$&+,:;=?@#|'<>.^*()%!-]", label: tr(lang, 'password.symbols') },
  ]
}

export async function getSignupPageTrans(): Promise<ObjString> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const trans = {
    s1Label: tr(lang, 'personal_info'),
    s2Label: tr(lang, 'auth_info'),
    clickNx: tr(lang, 'click_next_instead'),
    un: tr(lang, 'username'),
    fn: tr(lang, 'first_name'),
    ln: tr(lang, 'last_name'),
    email: tr(lang, 'email'),
    pass: tr(lang, 'password'),
    passConf: tr(lang, 'password_confirmation'),
    unLenErr: tr(lang, 'user.create.username.error', { Min: UserNameMinLength, Max: UserNameMaxLength }),
    unValErr: tr(lang, 'user.create.username.valid.error'),
    fnErr: tr(lang, 'user.create.first_name.error', {
      Min: UserFirstNameMinLength,
      Max: UserFirstNameMaxLength,
    }),
    lnErr: tr(lang, 'user.create.last_name.error', {
      Min: UserLastNameMinLength,
      Max: UserLastNameMaxLength,
    }),
    emailErr: tr(lang, 'user.create.email.error'),
    passMinErr: tr(lang, 'password.min_length', { Min: UserPasswordMinLength }),
    passMaxErr: tr(lang, 'password.max_length', { Max: UserPasswordMaxLength }),
    r: tr(lang, 'required'),
    passConfErr: tr(lang, 'password_confirmation.do_not_much'),
    correct: tr(lang, 'form.fields.invalid'),
    createAcc: tr(lang, 'account.create'),
    prev: tr(lang, 'previous'),
    next: tr(lang, 'next'),
    cancel: tr(lang, 'cancel'),
    profileImg: tr(lang, 'user.profile_information.image'),
    optionaImg: tr(lang, 'user.profile_information.optional_image'),
  }

  return trans
}

const LOGIN_PAGE_URL = process.env.LOGIN_PAGE_URL || ''

export async function redirectToAuthStatus(redirectTo: string): Promise<void> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(Cookies.RefreshToken)?.value
  if (refreshToken) {
    redirect(redirectTo, RedirectType.replace)
  } else {
    redirect(LOGIN_PAGE_URL)
  }
}
