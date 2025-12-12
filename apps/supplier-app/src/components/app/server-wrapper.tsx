import 'server-only'
import { redirect } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import ClientWrapper from '@/components/app/client-wrapper'
import AppHeader from '@/components/app/header/app-header'
import { getClientInformation } from '@megacommerce/shared/server'
import { ServerError } from '@megacommerce/ui/server'
import { getUserAuthInfo } from '@/helpers/server'

type Props = {
  children: React.ReactNode
}

async function ServerWrapper({ children }: Props) {
  const { languageName, languageSymbol, currency, location: country } = await getClientInformation()
  const { email, firstName, success, isInternalError } = await getUserAuthInfo()

  if (!success && isInternalError)
    return (
      <html lang='en' {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <ServerError />
        </body>
      </html>
    )

  if (!success) redirect(`${process.env.LOGIN_PAGE_URL}`)

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
