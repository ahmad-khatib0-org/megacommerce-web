import 'server-only'
import Image from 'next/image'

import SignupWrapper from '@/components/signup/signup-wrapper'
import { AssetsPaths } from '@/static/shared'
import { getPasswordRequirements, getSignupPageTrans } from '@/helpers/server'

async function Page() {
  const trans = await getSignupPageTrans()
  const requirements = await getPasswordRequirements()

  return (
    <main className='w-full px-10 grid grid-cols-[66%,_1fr] mt-4'>
      <SignupWrapper tr={trans} passwordRequirements={requirements} />
      <div className='relative min-h-[80vh] select-none'>
        <Image
          src={AssetsPaths.signupImg}
          alt='Megacommerce supplier platform'
          sizes='100%'
          fill
          priority
          style={{ objectFit: 'fill' }}
        />
      </div>
    </main>
  )
}

export default Page
