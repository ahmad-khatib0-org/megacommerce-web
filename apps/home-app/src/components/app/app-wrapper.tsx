import 'server-only'

type Props = {
  children: React.ReactNode
}

async function AppWrapper({ children }: Props) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export default AppWrapper
