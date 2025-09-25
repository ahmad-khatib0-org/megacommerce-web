import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import Header from '@/components/app/header'

type Props = {
  children: React.ReactNode
}

async function AppWrapper({ children }: Props) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Header />
          {children}
        </MantineProvider>
        <ToastContainer />
      </body>
    </html>
  )
}

export default AppWrapper
