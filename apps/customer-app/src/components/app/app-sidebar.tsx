'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Modal, Button, Tooltip } from '@mantine/core'
import { IconHome, IconShoppingBag, IconCreditCard, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'

import { useAppStore } from '@/store'

type SidebarTranslations = {
  dashboard: string
  orders: string
  payments: string
  logout: string
  logoutConfirmationTitle: string
  logoutConfirmationMessage: string
  cancel: string
}

type Props = {
  email?: string
  firstName?: string
  tr: SidebarTranslations
}

function AppSidebar({ email, firstName, tr }: Props) {
  const router = useRouter()
  const updateClientInfo = useAppStore((state) => state.updateClientInfo)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (email || firstName) updateClientInfo({ email, firstName })
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push(`${process.env.NEXT_PUBLIC_LOGIN_PAGE_URL || '/'}`)
      } else {
        console.error('Logout failed')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoggingOut(false)
      setIsLogoutModalOpen(false)
    }
  }

  const navItems = [
    { href: '/dashboard', icon: IconHome, label: tr.dashboard },
    { href: '/orders', icon: IconShoppingBag, label: tr.orders },
    { href: '/payments', icon: IconCreditCard, label: tr.payments },
  ]

  return (
    <>
      <div
        style={{
          background:
            'linear-gradient(328deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 100%, rgba(0, 212, 255, 1) 100%)',
        }}
        className={`h-full max-h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'
          } flex flex-col`}>
        <div className='flex items-center justify-between p-4 border-b border-white/20'>
          {isExpanded && <span className='font-bold text-lg text-white'>Menu</span>}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='p-1 hover:bg-white/20 rounded transition-colors'>
            {isExpanded ? <IconX size={20} color='white' /> : <IconMenu2 size={20} color='white' />}
          </button>
        </div>

        <nav className='flex-1 p-4 space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.href} label={item.label} disabled={isExpanded} position='right'>
                <Link
                  href={item.href}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors text-gray-800 font-medium'>
                  <Icon size={20} className='flex-shrink-0 text-white' />
                  {isExpanded && <span className='text-white'>{item.label}</span>}
                </Link>
              </Tooltip>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className='p-4 border-t border-white/20'>
          <Tooltip label={tr.logout} disabled={isExpanded} position='right'>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors text-white font-medium'>
              <IconLogout size={20} className='flex-shrink-0' />
              {isExpanded && <span>{tr.logout}</span>}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        opened={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={tr.logoutConfirmationTitle}
        centered>
        <div className='space-y-4'>
          <p>{tr.logoutConfirmationMessage}</p>
          <div className='flex gap-3 justify-end'>
            <Button variant='outline' onClick={() => setIsLogoutModalOpen(false)}>
              {tr.cancel}
            </Button>
            <Button color='red' onClick={handleLogout} loading={isLoggingOut}>
              {tr.logout}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AppSidebar
