import 'server-only'
import { redirect } from 'next/navigation'

import {
  getClientInformation,
  getForwardableHeaders,
  getUserAuthInfo,
  Trans,
} from '@megacommerce/shared/server'
import { ServerError } from '@megacommerce/ui/server'

import AppHeader from '@/components/app/header/app-header'
import AppSidebar from '@/components/app/app-sidebar'

async function getSidebarTranslations(lang: string) {
  const tr = Trans.tr
  return {
    dashboard: tr(lang, 'sidebar.dashboard'),
    orders: tr(lang, 'sidebar.orders'),
    payments: tr(lang, 'sidebar.payments'),
    logout: tr(lang, 'sidebar.logout'),
    logoutConfirmationTitle: tr(lang, 'sidebar.logout_confirmation_title'),
    logoutConfirmationMessage: tr(lang, 'sidebar.logout_confirmation_message'),
    cancel: tr(lang, 'cancel'),
  }
}

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()
  const { email, firstName, success, isInternalError } = await getUserAuthInfo(await getForwardableHeaders())
  const lang = await Trans.getUserLang()
  const sidebarTr = await getSidebarTranslations(lang)

  if (!success && isInternalError) return <ServerError />
  if (!success) redirect(`${process.env.LOGIN_PAGE_URL}`)

  return (
    <div className='grid grid-cols-[auto,1fr] min-h-screen max-h-screen'>
      <AppSidebar email={email} firstName={firstName} tr={sidebarTr} />
      <div className='grid grid-rows-[auto,1fr] max-h-screen overflow-hidden'>
        <div className='sticky top-0 z-10 h-14'>
          <AppHeader info={ci} />
        </div>
        <div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 56px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
