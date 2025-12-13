import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import { getClientInformation } from '@megacommerce/shared/server'
import ClientWrapper from '@/components/app/client-wrapper'
import AppHeader from '@/components/app/header/app-header'

type Props = {
  children: React.ReactNode
}

async function ServerWrapper({ children }: Props) {
  const { languageName, languageSymbol, currency, location: country } = await getClientInformation()

  return (
    <html lang={languageSymbol} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider>
          <AppHeader lang={languageSymbol} />
          {children}
        </MantineProvider>
        <ToastContainer />
        <ClientWrapper clientInfo={{ languageName, languageSymbol, country, currency }} />
      </body>
    </html>
  )
}

export default ServerWrapper
