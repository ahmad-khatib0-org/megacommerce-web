import 'server-only'
import { redirect } from 'next/navigation'
import { ServerError } from '@megacommerce/ui/server'
import { getClientInformation, getForwardableHeaders, getUserAuthInfo } from '@megacommerce/shared/server'

import AppHeader from '@/components/app/header/app-header'
import AppSidebar from '@/components/app/app-sidebar'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()
  const { email, firstName, success, isInternalError } = await getUserAuthInfo(await getForwardableHeaders())

  if (!success && isInternalError) return <ServerError />
  if (!success) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    redirect(`${process.env.LOGIN_PAGE_URL}`)
  }

  return (
    <div className='grid grid-cols-[auto,1fr] min-h-screen'>
      <AppSidebar email={email} firstName={firstName} />
      <div className='grid grid-rows-[auto,1fr]'>
        <AppHeader lang={ci.languageSymbol} />
        {children}
      </div>
    </div>
  )
}
