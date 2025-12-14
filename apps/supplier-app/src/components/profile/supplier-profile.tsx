'use client'

import { useEffect, useState } from 'react'
import { Card, Loader, Button, Avatar, Divider, Badge, Grid, Text, Group } from '@mantine/core'
import { ObjString, handleGrpcWebErr } from '@megacommerce/shared/client'
import { SupplierProfile as SupplierProfileType } from '@megacommerce/proto/web/users/v1/supplier_profile'
import { usersClient } from '@/helpers/client/grpc'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
}

function SupplierProfile({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [profile, setProfile] = useState<SupplierProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setErr('')

      const res = await usersClient.GetSupplierProfile({})

      if (res.error) {
        setErr(res.error.message || tr.errorLoading)
        return
      }

      if (res.data) {
        setProfile(res.data)
      }
    } catch (error) {
      setErr(handleGrpcWebErr(error, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader />
      </div>
    )
  }

  if (err) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
        <p className='text-red-500 font-medium'>{err}</p>
        <Button onClick={() => fetchProfile()} className='bg-red-600 hover:bg-red-500'>
          {tr.tryAgain}
        </Button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>{tr.errorLoading}</p>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <Card.Section withBorder inheritPadding py='md'>
          <h1 className='text-2xl font-bold'>{tr.title}</h1>
        </Card.Section>

        <Card.Section withBorder inheritPadding py='md'>
          <Grid gutter='lg'>
            <Grid.Col span={{ base: 12, sm: 'auto' }}>
              <div className='flex justify-center'>
                <Avatar
                  src={profile.image ? `${process.env['NEXT_PUBLIC_MEDIA_BASE_URL']}/${profile.image}` : null}
                  name={profile.fullName}
                  size={120}
                  radius='xl'
                />
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div className='space-y-5'>
                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.fullName}
                  </Text>
                  <Text weight={500}>{profile.fullName}</Text>
                </div>

                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.username}
                  </Text>
                  <Text weight={500}>{profile.username}</Text>
                </div>

                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.email}
                  </Text>
                  <div className='flex items-center gap-2 mt-1'>
                    <Text weight={500}>{profile.email}</Text>
                    <Badge size='sm' color={profile.isEmailVerified ? 'green' : 'red'}>
                      {profile.isEmailVerified ? tr.emailVerified : tr.emailNotVerified}
                    </Badge>
                  </div>
                </div>
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div className='space-y-5'>
                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.membership}
                  </Text>
                  <Text weight={500} style={{ textTransform: 'capitalize' }}>
                    {profile.membership}
                  </Text>
                </div>

                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.createdAt}
                  </Text>
                  <Text weight={500}>{new Date(Number(profile.createdAt)).toLocaleDateString()}</Text>
                </div>

                <div>
                  <Text size='sm' c='dimmed'>
                    {tr.updatedAt}
                  </Text>
                  <Text weight={500}>{new Date(Number(profile.updatedAt)).toLocaleDateString()}</Text>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>
    </div>
  )
}

export default SupplierProfile
