import '@mantine/core/styles.css'
import './global.css'

import { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: 'Megacommerce supplier app',
  description: 'the main Megacommerce.com supplier web app!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
