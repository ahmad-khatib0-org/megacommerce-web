import 'server-only'
import Image from 'next/image'

import SignupWrapper from '@/components/signup/signup-wrapper'
import { AssetsPaths } from '@/static/shared'
import { getSignupPageTrans } from '@/helpers/server'

async function Page() {
  const trans = await getSignupPageTrans()

  return (
    <main className="w-full px-10 grid grid-cols-[66%,_1fr] mt-4">
      <SignupWrapper tr={trans} />
      <div className="relative min-h-[80vh]">
        <Image
          src={AssetsPaths.signupImg}
          alt="Megacommerce supplier platform"
          sizes="100%"
          fill
          style={{ objectFit: 'fill' }}
        />
      </div>
    </main>
  )
}

export default Page
