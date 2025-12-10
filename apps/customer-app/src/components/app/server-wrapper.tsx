import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import ClientWrapper from '@/components/app/client-wrapper'
import { getClientInformation } from '@megacommerce/shared/server'
import { checkUserAuth } from '@/helpers/server'

type Props = {
  children: React.ReactNode
}

async function ServerWrapper({ children }: Props) {
  const ci = await getClientInformation()
  const { email, firstName, success, isInternalError } = await checkUserAuth()

  return (
    <html lang={ci.languageSymbol} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider>{children}</MantineProvider>
        <ToastContainer />
        <ClientWrapper
          clientInfo={{
            email: email,
            firstName: firstName,
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
