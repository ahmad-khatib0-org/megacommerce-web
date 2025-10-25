import 'server-only'
import { getClientInformation } from "@megacommerce/shared/server"

import AppHeader from "@/components/app/header/app-header"

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ci = await getClientInformation()

  return <div className='grid grid-cols-[auto,1fr]'>
    <div
      style={{ background: 'linear-gradient(147deg,rgba(35, 36, 0, 1) 9%, rgba(121, 119, 9, 1) 35%, rgba(255, 170, 0, 1) 100%);' }}
      className="w-32 h-screen">
      <div className="">
        <p>This is a placeholder for the sidebar</p>
      </div>
    </div>
    <div className="flex flex-col">
      <AppHeader info={ci} />
      {children}
    </div>
  </div>
}
