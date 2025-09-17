import { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import '@mantine/core/styles.css'
import './global.css'

import { ServerError } from '@megacommerce/ui/server'
import AppWrapper from '@/components/app/app-wrapper'
import { system } from '@/helpers/server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Welcome Megacommece.com',
  description: 'Amazon scale E-commerce platform',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    await system()
  } catch (err) {
    return (
      <html lang="en" {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <ServerError />
      </html>
    )
  }

  return <AppWrapper>{children}</AppWrapper>
}
