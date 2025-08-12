import 'client-only'
import { object, string } from 'yup'
import {
  ObjString,
  UserFirstNameMaxLength,
  UserFirstNameMinLength,
  UserLastNameMaxLength,
  UserLastNameMinLength,
  UserNameMaxLength,
  UserNameMinLength,
} from '@megacommerce/shared'
import { UserNameRegex } from '@megacommerce/shared'

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
    return { email: '', password: '' }
  }
}
