import 'server-only'
import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserPasswordMaxLength,
  UserPasswordMinLength,
  UserImageMaxSizeBytes,
} from '@megacommerce/shared'
import { getAppropriateSize, Trans } from '@megacommerce/shared/server'
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
  const size = getAppropriateSize(UserImageMaxSizeBytes, 'MB')

  const trans = {
    s1Label: tr(lang, 'company_info'),
    s2Label: tr(lang, 'auth_info'),
    s3Label: tr(lang, 'additional_info'),
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
    maxImgSz: tr(lang, 'image.max_size', { Max: size, Unit: 'MB' }),
    logo: tr(lang, 'company_logo'),
    optional: tr(lang, 'optional'),
    subMsg: tr(lang, 'optional'),
    correct: tr(lang, 'form.fields.invalid'),
    createAcc: tr(lang, 'account.create'),
    prev: tr(lang, 'previous'),
    next: tr(lang, 'next'),
  }

  return trans
}

interface AuthResult {
  success: boolean
  email?: string
  firstName?: string
  isInternalError: boolean
}

/**
 * Checks user authentication with a retry mechanism.
 * @param maxRetries - The maximum number of times to retry on
 * internal server errors. Defaults to 2.
 * @returns An object containing the success status, user info, and an error flag.
 */
export async function checkUserAuth(maxRetries: number = 2): Promise<AuthResult> {
  let attempt = 0
  // A simple helper function to create a delay
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  while (attempt <= maxRetries) {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/check`
      const response = await fetch(endpoint, { method: 'POST', cache: 'no-store' })
      if (response.ok) {
        const data = (await response.json()) as { success: boolean; email: string; firstName: string }
        return {
          success: data.success,
          email: data.email,
          firstName: data.firstName,
          isInternalError: false,
        }
      }

      if (response.status === 401) {
        return { success: false, isInternalError: false }
      }

      if (response.status >= 400 && response.status < 500) {
        return { success: false, isInternalError: false }
      }

      if (response.status >= 500) {
        attempt++
        if (attempt <= maxRetries) {
          console.warn(`Auth check failed (server error), retrying... Attempt ${attempt} of ${maxRetries}`)
          await delay(1000 * attempt)
          continue
        } else {
          return { success: false, isInternalError: true }
        }
      }
    } catch (error) {
      // --- NETWORK ERROR ---
      // The fetch itself failed (e.g., DNS, CORS, offline). This is transient.
      attempt++
      if (attempt <= maxRetries) {
        console.warn(
          `Auth check failed (network error), retrying... Attempt ${attempt} of ${maxRetries}`,
          error
        )
        await delay(1000 * attempt)
        continue
      } else {
        // Retries exhausted
        return { success: false, isInternalError: true }
      }
    }
  }

  // Failsafe, should not be reached
  return { success: false, isInternalError: true }
}
