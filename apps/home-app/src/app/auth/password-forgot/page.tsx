import Image from "next/image"
import { Metadata } from "next"
import { Button } from "@mantine/core"

import { Trans } from "@megacommerce/shared/server"

import PasswordForgotWrapper from "@/components/auth/password-forgot/password-forgot-wrapper"
import { Assets } from "@/helpers/shared"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await Trans.getUserLang()
  const tr = Trans.tr
  return {
    title: tr(lang, 'forgot.password.page_title'),
  }
}

async function Page() {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  const trans = {
    email: tr(lang, 'email'),
    emailErr: tr(lang, 'email.invalid'),
    send: tr(lang, 'forgot.password.send_instructions'),
    goToMsg: tr(lang, 'forgot.password.go_back')
  }

  return (
    <main>
      <section className='flex items-center justify-center min-h-screen'>
        <PasswordForgotWrapper
          tr={trans}
          Header={
            <div className="flex flex-col gap-y-4">
              <div className="relative h-10 w-10">
                <Image src={Assets.imgLock} alt={"a yellow lock with 3 dots"} fill sizes="100%" style={{ objectFit: 'cover' }} />
              </div>
              <h1 className="font-bold text-2xl text-orange-700">{tr(lang, 'forgot.password.title')}</h1>
              <p className="">{tr(lang, 'forgot.password.subtitle')}</p>
            </div>
          }
          BackButton={
            <Button
              component="a"
              href={'/auth/login'}
              variant="outline"
              className="font-bold text-xl" >
              {tr(lang, 'forgot.password.go_back')}
            </Button>
          }
        />
      </section>
    </main>
  )
}

export default Page
