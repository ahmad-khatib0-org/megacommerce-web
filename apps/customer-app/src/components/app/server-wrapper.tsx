import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import ClientWrapper from '@/components/app/client-wrapper'
import { getClientInformation } from '@megacommerce/shared/server'

type Props = {
  children: React.ReactNode
}

async function ServerWrapper({ children }: Props) {
  const { languageSymbol, languageName, currency, location } = await getClientInformation()

  return (
    <html lang={languageSymbol} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider>{children}</MantineProvider>
        <ToastContainer />
        <ClientWrapper clientInfo={{ languageSymbol, languageName, currency, country: location }} />
      </body>
    </html>
  )
}

export default ServerWrapper
