import 'server-only'
import { redirect } from 'next/navigation'

import { getClientInformation } from '@megacommerce/shared/server'
import { ServerError } from '@megacommerce/ui/server'

import AppHeader from '@/components/app/header/app-header'
import AppSidebar from '@/components/app/app-sidebar'
import { getForwardableHeaders, getUserAuthInfo } from '@/helpers/server'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()
  const { email, firstName, success, isInternalError } = await getUserAuthInfo(await getForwardableHeaders())

  if (!success && isInternalError) return <ServerError />
  if (!success) redirect(`${process.env.LOGIN_PAGE_URL}`)

  return (
    <div className='grid grid-cols-[auto,1fr] min-h-screen'>
      <AppSidebar email={email} firstName={firstName} />
      <div className='grid grid-rows-[auto,1fr]'>
        <AppHeader info={ci} />
        {children}
      </div>
    </div>
  )
}
