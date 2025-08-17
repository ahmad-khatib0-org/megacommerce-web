import 'client-only'
import { object, string, ref } from 'yup'
import { SupplierCreateRequest } from '@megacommerce/proto/web/users/v1/supplier'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
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

export class SignupHelpers {
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
      image: '',
    }
    return req
  }
}
