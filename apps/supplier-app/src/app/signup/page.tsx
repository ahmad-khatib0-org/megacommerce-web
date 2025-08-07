import Image from 'next/image'
import { AssetsPaths } from '@/static/shared'

function Page() {
  return (
    <main className="w-full px-10 grid grid-cols-[66%,_1fr] mt-4">
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
