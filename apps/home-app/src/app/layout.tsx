import { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import { ToastContainer } from 'react-toastify'
import '@mantine/core/styles.css'
import './global.css'

import { ServerError } from '@megacommerce/ui/server'
import AppWrapper from '@/components/app/app-wrapper'
import { System } from '@/helpers/server'

export const metadata: Metadata = {
  title: 'Welcome Megacommece.com',
  description: 'Amazon scale E-commerce platform',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    await System.instance().init()
  } catch (err) {
    console.error(err)
    return (
      <html lang="en" {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <ServerError />
      </html>
    )
  }

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
