import Image from 'next/image'

import { Trans } from '@megacommerce/shared/server'
import { ServerError } from '@megacommerce/ui/server'
import { SearchParams, UserPasswordMaxLength, UserPasswordMinLength } from '@megacommerce/shared'

import LoginWrapper from '@/components/auth/login/login-wrapper'
import { oauthServiceStatusChecker } from '@/helpers/server'
import { Assets } from '@/helpers/shared'

type Props = {}

async function Page({ }: Props) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()

  const trans = {
    r: tr(lang, 'required'),
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
      <section className='grid grid-cols-[55%,1fr]'>
        <LoginWrapper tr={trans} />
        <div className='relative h-screen w-full select-none'>
          <Image
            src={Assets.login}
            alt='describe authentication flow'
            fill
            sizes='100%'
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>
    )
  } catch (err) {
    return <ServerError />
  }
}

export default Page
