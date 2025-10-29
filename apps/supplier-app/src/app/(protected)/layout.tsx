import 'server-only'
import { getClientInformation } from '@megacommerce/shared/server'

import AppHeader from '@/components/app/header/app-header'
import AppSidebar from '@/components/app/app-sidebar'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()

  return (
    <div className='grid grid-cols-[auto,1fr] min-h-screen'>
      <AppSidebar />
      <div className='grid grid-rows-[auto,1fr]'>
        <AppHeader info={ci} />
        {children}
      </div>
    </div>
  )
}
