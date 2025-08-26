import Image from "next/image"
import { Button } from "@mantine/core"
import checkMarkImg from './check-mark.jpg'

type Props = {
  title: string,
  subtitle?: string
  goToLink?: string
  goToMsg?: string
}

export function SuccessMessage({ title, subtitle, goToLink, goToMsg }: Props) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <div className="relative h-60 w-60">
        <Image
          src={checkMarkImg}
          alt={'check mark indicating that operation went successfully'}
          fill
          priority
          sizes="100%"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <h1 className="font-bold text-2xl text-orange-700">{title}</h1>
      {subtitle && <p className="text-lg font-medium">{subtitle}</p>}
      {goToLink &&
        <Button
          component="a"
          href={goToLink}
          unstyled
          style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '16px' }}
          className="bg-red-500 hover:bg-red-300! text-white font-bold"
          aria-label={goToMsg}>
          {goToMsg}
        </Button>
      }
    </div>
  )
}


