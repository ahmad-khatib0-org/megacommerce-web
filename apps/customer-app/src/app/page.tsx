import 'server-only'
import { redirectToAuthStatus } from '@/helpers/server'

export default async function Index() {
  await redirectToAuthStatus('/orders')
  return (
    <div className='flex justify-center items-center h-screen'>
      <p>Redirecting...</p>
    </div>
  )
}
