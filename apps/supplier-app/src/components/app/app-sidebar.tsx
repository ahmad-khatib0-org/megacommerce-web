'use client'
import { useEffect } from 'react'

import { useAppStore } from '@/store'

type Props = {
  email?: string
  firstName?: string
}

function AppSidebar({ email, firstName }: Props) {
  const updateClientInfo = useAppStore((state) => state.updateClientInfo)

  useEffect(() => {
    if (email || firstName) updateClientInfo({ email, firstName })
  }, [])

  return (
    <div className='w-32 h-full'>
      <div className=''></div>
    </div>
  )
}

export default AppSidebar
