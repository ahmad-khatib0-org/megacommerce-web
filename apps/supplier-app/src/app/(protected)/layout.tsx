import 'server-only'
import { redirect } from 'next/navigation'
import { ServerError } from '@megacommerce/ui/server'
import {
  getClientInformation,
  getForwardableHeaders,
  getUserAuthInfo,
  Trans,
} from '@megacommerce/shared/server'

import AppHeader from '@/components/app/header/app-header'
import AppSidebar from '@/components/app/app-sidebar'

const getSidebarTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    'sidebar.supplier.dashboard': tr(lang, 'sidebar.supplier.dashboard'),
    'sidebar.supplier.profile': tr(lang, 'sidebar.supplier.profile'),
    'sidebar.supplier.inventory': tr(lang, 'sidebar.supplier.inventory'),
    'sidebar.supplier.products': tr(lang, 'sidebar.supplier.products'),
    'sidebar.supplier.logout': tr(lang, 'sidebar.supplier.logout'),
    'sidebar.supplier.logout_confirmation_title': tr(lang, 'sidebar.supplier.logout_confirmation_title'),
    'sidebar.supplier.logout_confirmation_message': tr(lang, 'sidebar.supplier.logout_confirmation_message'),
    cancel: tr(lang, 'cancel'),
  }
}

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()
  const lang = await Trans.getUserLang()
  const { email, firstName, success, isInternalError } = await getUserAuthInfo(await getForwardableHeaders())
  const sidebarTr = getSidebarTranslations(lang)

  if (!success && isInternalError) return <ServerError />
  if (!success) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    redirect(`${process.env.LOGIN_PAGE_URL}`)
  }

  return (
    <div className='grid grid-cols-[auto,1fr] min-h-screen max-h-screen'>
      <AppSidebar email={email} firstName={firstName} tr={sidebarTr} />
      <div className='grid grid-rows-[auto,1fr] max-h-screen overflow-hidden'>
        <div className='sticky top-0 z-10 h-14'>
          <AppHeader lang={ci.languageSymbol} />
        </div>
        <div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 56px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
