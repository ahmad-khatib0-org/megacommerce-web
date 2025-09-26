'use client'
import { IconUser } from "@tabler/icons-react"
import { ObjString } from "@megacommerce/shared"
import Link from "next/link"
import { PagesPaths } from "@/helpers/client"

type Props = {
  tr: ObjString
}

function Account({ tr }: Props) {
  return (
    <div className="flex items-center gap-x-2">
      <IconUser size={36} />
      <div className="flex flex-col">
        <p className="font-medium">{tr.welcome}</p>
        <div className="flex items-center gap-x-1 font-medium">
          <Link href={PagesPaths.login}>{tr.signin}</Link>
          <p>/</p>
          <Link href={PagesPaths.signupBuyer}>{tr.register}</Link>
        </div>
      </div>
    </div>
  )
}

export default Account
