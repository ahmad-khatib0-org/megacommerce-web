import 'server-only'
import { ToastContainer } from 'react-toastify'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'

import Header from '@/components/app/header'
import { Trans } from '@megacommerce/shared/server'

type Props = {
  children: React.ReactNode
}

function getTranslations(lang: string) {
  const tr = Trans.tr;
  return {
    placeholder: tr(lang, 'search.looking_for')
  }
}

async function AppWrapper({ children }: Props) {
  const lang = await Trans.getUserLang()

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Header tr={getTranslations(lang)} />
        <MantineProvider>{children}</MantineProvider>
        <ToastContainer />
      </body>
    </html>
  )
}

export default AppWrapper
