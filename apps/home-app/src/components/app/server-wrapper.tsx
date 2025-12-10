import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import Header from '@/components/app/header/header'
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
        <MantineProvider>
          <Header lang={languageSymbol} />
          {children}
        </MantineProvider>
        <ToastContainer />
        <ClientWrapper clientInfo={{ languageSymbol, country: location, currency, languageName }} />
      </body>
    </html>
  )
}

export default ServerWrapper
