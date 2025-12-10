import '@mantine/core/styles.css'
import './global.css'
import { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { ServerError } from '@megacommerce/ui/server'

import ServerWrapper from '@/components/app/server-wrapper'
import { system } from '@/helpers/server'

export const metadata: Metadata = {
  title: 'Megacommerce Customer app',
  description: 'The main Megacommerce.com Customer web app!',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    await system()
  } catch (err) {
    return (
      <html lang='en' {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <ServerError />
        </body>
      </html>
    )
  }

  return <ServerWrapper>{children}</ServerWrapper>
}
