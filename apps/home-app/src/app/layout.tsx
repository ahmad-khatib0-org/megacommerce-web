import { Metadata } from 'next'
import './global.css'

import AppWrapper from '@/components/app/app-wrapper'

export const metadata: Metadata = {
  title: 'Welcome Megacommece.com',
  description: 'Amazon scale E-commerce platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppWrapper>{children}</AppWrapper>
}
