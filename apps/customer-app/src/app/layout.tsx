import './global.css'

export const metadata = {
  title: 'Welcome to customer-app',
  description: 'The main Megacommerce.com customer web app!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
