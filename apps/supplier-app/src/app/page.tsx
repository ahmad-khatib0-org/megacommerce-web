import 'server-only'
import { redirectToAuthStatus } from '@/helpers/server'

export const metadata = {
  title: 'Megacommerce supplier app',
  description: 'The main Megacommerce.com supplier web app!',
}

export default async function Index() {
  await redirectToAuthStatus('/products')
  return (
    <div className='flex justify-center items-center h-screen'>
      <p>Redirecting...</p>
    </div>
  )
}
