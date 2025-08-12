import '@mantine/core/styles.css'
import './global.css'

import { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import { ServerError } from '@megacommerce/ui/server'

import { System } from '@/helpers/server'

export const metadata: Metadata = {
  title: 'Megacommerce supplier app',
  description: 'The main Megacommerce.com supplier web app!',
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
