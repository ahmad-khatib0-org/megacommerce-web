import 'server-only'
import Image from 'next/image'

import SignupWrapper from '@/components/signup/signup-wrapper'
import { getPasswordRequirements, getSignupPageTrans } from '@/helpers/server'

async function Page() {
  const trans = await getSignupPageTrans()
  const requirements = await getPasswordRequirements()

  return (
    <main className='w-full grid grid-cols-[1fr,420px] justify-center items-center min-h-screen'>
      <SignupWrapper tr={trans} passwordRequirements={requirements} />
      <div className='relative size-full'>
        <Image src={'/images/signup.jpg'} alt='signup' priority fill sizes='100%' className='object-fill' />
      </div>
    </main>
  )
}

export default Page
