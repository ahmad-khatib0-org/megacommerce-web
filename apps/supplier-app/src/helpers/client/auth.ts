import { object, string } from "yup"

export class AuthHelpers {
  static infoForm() {
    return object().shape({
      // username: string     
    })
  }

  static infoFormValues() {
    return { username: '', first_name: '', last_name: '' }
  }

  static authInfoFormValues() {
    return { email: '', password: '' }
  }
}
