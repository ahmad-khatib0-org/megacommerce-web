import Image from 'next/image'

import { Trans } from '@megacommerce/shared/server'
import { ServerError } from '@megacommerce/ui/server'
import { UserPasswordMaxLength, UserPasswordMinLength } from '@megacommerce/shared'

import LoginWrapper from '@/components/auth/login/login-wrapper'
import { oauthServiceStatusChecker } from '@/helpers/server'
import { Assets } from '@/helpers/shared'

type Props = {}

async function Page({ }: Props) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const trans = {
    r: tr(lang, 'required'),
    email: tr(lang, 'email'),
    password: tr(lang, 'password'),
    emailErr: tr(lang, 'user.create.email.error'),
    passMinErr: tr(lang, 'password.min_length', { Min: UserPasswordMinLength }),
    passMaxErr: tr(lang, 'password.max_length', { Max: UserPasswordMaxLength }),
    login: tr(lang, 'login'),
    wel: tr(lang, 'login.welcom_back'),
  }

  try {
    const isAlive = await oauthServiceStatusChecker.isOauthServiceAlive()
    if (!isAlive) return <ServerError />
    return (
      <section className='grid grid-cols-[1fr,auto] min-h-screen justify-center items-center'>
        <LoginWrapper tr={trans} />
        <div className='relative size-[500px] select-none rounded-md shadow-md me-4'>
          <Image
            src={Assets.login}
            alt='describe authentication flow'
            fill
            sizes='100%'
            className='me-4 rounded-md'
            style={{ objectFit: 'fill' }}
          />
        </div>
      </section>
    )
  } catch (err) {
    return <ServerError />
  }
}

export default Page
