import 'server-only'
import { Metadata } from 'next'

import { EmailConfirmationRequest } from '@megacommerce/proto/users/v1/auth'
import { SearchParams } from '@megacommerce/shared'
import { Trans, TransFunction } from '@megacommerce/shared/server'

import { ErrorPage } from '@megacommerce/ui/shared'
import EmailVerificationWrapper from '@/components/auth/email-verification/email-verification-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const lang = await Trans.getUserLang()
  const tr = Trans.tr
  return {
    title: tr(lang, 'email_confirm.page.title'),
  }
}

async function getPageTrans(tr: TransFunction, lang: string) {
  return {
    youCan: tr(lang, 'email_confirm.you_can_to_login'),
    goTo: tr(lang, 'login.go_to_login_page'),
  }
}

async function checkSearchParams(
  sp: SearchParams,
  tr: TransFunction,
  lang: string
): Promise<EmailConfirmationRequest> {
  const { token, token_id, email } = await sp
  const trID = 'url.search_params.missing'
  if (!token) throw tr(lang, trID, { Param: 'token' })
  if (!token_id) throw tr(lang, trID, { Param: 'token_id' })
  if (!email) throw tr(lang, trID, { Param: tr(lang, 'email') })
  return {
    token: token as string,
    tokenId: token_id as string,
    email: email as string,
  }
}

type Props = {
  searchParams: SearchParams
}

async function Page({ searchParams }: Props) {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  const trans = await getPageTrans(tr, lang)
  let request: EmailConfirmationRequest

  try {
    request = await checkSearchParams(searchParams, tr, lang)
  } catch (err) {
    return <ErrorPage title={tr(lang, 'url.invalid')} description={err as string} />
  }

  return (
    <main className=''>
      <section className='min-h-screen flex justify-center items-center'>
        <EmailVerificationWrapper tr={trans} req={request} />
      </section>
    </main>
  )
}

export default Page
