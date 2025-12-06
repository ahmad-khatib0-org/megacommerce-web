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
  const ci = await getClientInformation()

  return (
    <html lang={ci.languageSymbol} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider>
          <Header userLang={ci.languageSymbol} initialClientInfo={ci} />
          {children}
        </MantineProvider>
        <ToastContainer />
        <ClientWrapper
          clientInfo={{
            language: ci.languageSymbol,
            country: ci.location,
            currency: ci.currency,
            languageName: ci.languageName,
          }}
        />
      </body>
    </html>
  )
}

export default ServerWrapper
