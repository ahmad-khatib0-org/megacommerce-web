import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

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
        <MantineProvider>{children}</MantineProvider>
        <ToastContainer />
      </body>
    </html>
  )
}

export default AppWrapper
