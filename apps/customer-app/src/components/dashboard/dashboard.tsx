'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Card, Loader, Text } from '@mantine/core'

import { CustomerProfile } from '@megacommerce/proto/web/users/v1/customer_profile'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { useAppStore } from '@/store'
import { usersClient } from '@/helpers/client'

type Props = {
  tr: ObjString
}

function Dashboard({ tr }: Props) {
  const imagesHost = `${process.env['NEXT_PUBLIC_MEDIA_BASE_URL'] as string}`
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await (await usersClient()).GetCustomerProfile({})

      if (res.error) {
        setError(res.error.message)
        return
      }

      if (res.data) {
        setProfile(res.data)
      }
    } catch (err) {
      setError(handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const formatDate = (timestamp: bigint | number | string | undefined) => {
    if (!timestamp) return '-'
    const ms = typeof timestamp === 'string' ? parseInt(timestamp) : Number(timestamp)
    return new Date(ms).toLocaleDateString(clientInfo.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-96'>
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-96 border border-dashed border-black/30 rounded-lg p-6'>
        <Text size='lg' fw={500} c='red' className='mb-4'>
          {error}
        </Text>
        <Button onClick={fetchProfile} className='bg-red-600 hover:bg-red-500'>
          {tr.tryAgain}
        </Button>
      </div>
    )
  }

  if (!profile) {
    return <div className='text-center p-6'>{tr.title}</div>
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <div className='flex flex-col items-center mb-8'>
          <div className='relative w-32 h-32 mb-4'>
            {profile.image ? (
              <Image
                src={`${imagesHost}/${profile.image}`}
                alt={profile.fullName || 'Profile'}
                fill
                className='rounded-full object-cover'
              />
            ) : (
              <div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>No Image</span>
              </div>
            )}
          </div>
          <h1 className='text-3xl font-bold text-center'>{profile.fullName}</h1>
        </div>

        <div className='space-y-6'>
          {/* Full Name */}
          <div className='border-b pb-4'>
            <Text size='sm' c='dimmed' fw={500} className='mb-2'>
              {tr.fullName}
            </Text>
            <Text size='lg'>{profile.fullName}</Text>
          </div>

          {/* Email */}
          <div className='border-b pb-4'>
            <Text size='sm' c='dimmed' fw={500} className='mb-2'>
              {tr.email}
            </Text>
            <Text size='lg'>{profile.email}</Text>
            <div className='mt-2 flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${profile.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <Text size='sm' c={profile.isEmailVerified ? 'green' : 'red'}>
                {profile.isEmailVerified ? tr.verified : tr.notVerified}
              </Text>
            </div>
          </div>

          {/* Username */}
          <div className='border-b pb-4'>
            <Text size='sm' c='dimmed' fw={500} className='mb-2'>
              {tr.username}
            </Text>
            <Text size='lg'>{profile.username}</Text>
          </div>

          {/* Member Since */}
          <div>
            <Text size='sm' c='dimmed' fw={500} className='mb-2'>
              {tr.memberSince}
            </Text>
            <Text size='lg'>{formatDate(profile.createdAt)}</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
