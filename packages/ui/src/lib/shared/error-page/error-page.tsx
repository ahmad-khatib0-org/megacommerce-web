import Image from 'next/image'
import errorImage from './error.png'

type Props = {
  title: string
  description: string
}

export function ErrorPage({ title, description }: Props) {
  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-y-8">
        <div className="relative h-60 w-60">
          <Image src={errorImage} alt="error loading a page" sizes="100%" fill objectFit="cover" />
        </div>
        <h1 className="font-bold text-orange-700 text-2xl">{title}</h1>
        <p className="font-bold text-lg">{description}</p>
      </section>
    </main>
  )
}
