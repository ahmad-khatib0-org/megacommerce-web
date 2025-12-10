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
    <div
      style={{
        background:
          'linear-gradient(62deg, rgba(255, 171, 126, 1.000) 0.000%, rgba(255, 211, 102, 1.000) 50.000%, rgba(247, 206, 104, 1.000) 100.000%)',
      }}
      className='w-32 h-full'>
      <div className=''></div>
    </div>
  )
}

export default AppSidebar
