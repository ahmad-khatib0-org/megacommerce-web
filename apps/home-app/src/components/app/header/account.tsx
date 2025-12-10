'use client'
import Link from 'next/link'
import { IconUser } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'
import { PagesPaths } from '@/helpers/client'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
}

function Account({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)

  return (
    <div className='flex items-center gap-x-2'>
      <IconUser size={36} />
      <div className='flex flex-col'>
        <p className='font-medium line-clamp-1'>
          {tr.welcome} {clientInfo.firstName}
        </p>
        {!clientInfo.email && (
          <div className='flex items-center gap-x-1 font-medium'>
            <Link href={PagesPaths.login}>{tr.signin}</Link>
            <p>/</p>
            <Link href={PagesPaths.signupBuyer}>{tr.register}</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account
