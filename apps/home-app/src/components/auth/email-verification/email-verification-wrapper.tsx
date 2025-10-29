'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@mantine/core'

import { EmailConfirmationRequest } from '@megacommerce/proto/web/users/v1/auth'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { PageLoader } from '@megacommerce/ui/shared'

import { Assets } from '@/helpers/shared'
import { PagesPaths, usersClient } from '@/helpers/client'

type Props = {
  tr: ObjString
  req: EmailConfirmationRequest
}

function EmailVerificationWrapper({ tr, req }: Props) {
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const request = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await usersClient.EmailConfirmation(req)
      if (res.error) {
        setErrorMsg(res.error.message)
        return
      }
      setSuccessMsg(res.data!.message!)
    } catch (err) {
      setErrorMsg(handleGrpcWebErr(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    request()
  }, [])

  return (
    <>
      {loading && <PageLoader />}
      {successMsg && (
        <div className='flex flex-col justify-center items-center gap-y-8'>
          <div className='relative h-60 w-60'>
            <Image
              src={Assets.imgCheckMark}
              alt={'check mark indicating that email confirmed successfully'}
              fill
              priority
              sizes='100%'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h1 className='font-bold text-2xl text-orange-700'>{successMsg}</h1>
          <p className='text-lg font-medium'>{tr.youCan}</p>
          <Button
            component='a'
            href={PagesPaths.login}
            className='bg-red-500 px-6 py-2 text-white'
            bdrs={8}
            variant='filled'
            size='xl'
            aria-label={tr.goTo}>
            {tr.goTo}
          </Button>
        </div>
      )}

      {errorMsg && (
        <div className='flex flex-col justify-center items-center gap-y-16'>
          <div className='relative h-32 w-32'>
            <Image
              src={Assets.imgErrorAlert}
              alt={'alert error indicating that request to verify email failed'}
              fill
              priority
              sizes='100%'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h1 className='text-red-700 font-bold text-2xl'>{errorMsg}</h1>
        </div>
      )}
    </>
  )
}

export default EmailVerificationWrapper
