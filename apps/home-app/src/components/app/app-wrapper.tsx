import 'server-only'

import { Trans } from '@/helpers/server/app/index'

type Props = {
  children: React.ReactNode
}

async function AppWrapper({ children }: Props) {
  await Trans.instance().initTranslations()

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export default AppWrapper
