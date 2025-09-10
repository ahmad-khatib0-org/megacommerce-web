import 'server-only'

import Image from 'next/image'
import errorImage from './internal-error.png'

export const ServerError = () => {
  return (
    <section className="grid grid-cols-[1fr,_55%] w-full px-4">
      <div className="flex flex-col items-start justify-center mt-12">
        <h1 style={{ color: '#0d0c22' }} className="text-4xl font-bold">
          Internal Server Error
        </h1>
        <p className="mt-12 text-xl">
          Sorry we encountered some technical issues during you last operation
        </p>
        <p className="mt-10 text-xl">
          Please try to refresh you browser tab, or contact the support team if the problem persists.
        </p>
      </div>
      <div className="relative w-full h-[400px]">
        <Image
          src={errorImage}
          alt="describe an internal error"
          sizes="100%"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </section>
  )
}
