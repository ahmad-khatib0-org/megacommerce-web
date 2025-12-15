'use client'
import { useEffect, useState } from 'react'
import { Card, Loader, Button, Grid, Text, Group, ThemeIcon } from '@mantine/core'
import {
  IconTrendingUp,
  IconPackages,
  IconBox,
  IconStar,
  IconShoppingCart,
  IconEye,
} from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'
import { DashboardStats } from '@megacommerce/proto/web/users/v1/dashboard'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { usersClient } from '@/helpers/client/grpc'
import { useAppStore } from '@/store'

type Props = {
  tr: ObjString
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Group justify='space-between' mb='md'>
        <div>
          <Text size='sm' c='dimmed'>
            {label}
          </Text>
          <Text size='lg' weight={500}>
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant='light' size='lg' radius='md'>
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  )
}

function SupplierDashboard({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setErr('')

      const res = await (await usersClient()).GetSupplierDashboard({})

      if (res.error) {
        setErr(res.error.message || tr.errorLoading)
        return
      }

      if (res.data) {
        setStats(res.data)
      }
    } catch (error) {
      setErr(handleGrpcWebErr(error, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
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
        <Button onClick={() => fetchDashboard()} className='bg-red-600 hover:bg-red-500'>
          {tr.tryAgain}
        </Button>
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>{tr.title}</h1>
        <p className='text-gray-600'>Welcome back to your supplier dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className='mb-10'>
        <h2 className='text-xl font-semibold mb-4'>Key Metrics</h2>
        <Grid gutter='lg'>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconPackages size={24} />}
              label={tr.totalProducts}
              value={stats?.totalProducts || 0}
              color='blue'
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconBox size={24} />}
              label={tr.totalInventory}
              value={stats?.totalInventoryItems || 0}
              color='green'
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconStar size={24} />}
              label={tr.totalReviews}
              value={stats?.totalReviews || 0}
              color='yellow'
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconShoppingCart size={24} />}
              label={tr.pendingOrders}
              value={stats?.pendingOrders || 0}
              color='orange'
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconShoppingCart size={24} />}
              label={tr.totalOrders}
              value={stats?.totalOrders || 0}
              color='violet'
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<IconEye size={24} />}
              label='Product Visits'
              value={stats?.productVisitsCount || 0}
              color='cyan'
            />
          </Grid.Col>
        </Grid>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Visits by Period Chart Placeholder */}
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Card.Section withBorder inheritPadding py='md'>
            <h3 className='text-lg font-semibold'>{tr.visitsByPeriod}</h3>
          </Card.Section>
          <Card.Section inheritPadding py='md'>
            <div className='h-64 flex flex-col items-center justify-center bg-gray-50 rounded'>
              <IconTrendingUp size={48} stroke={1.5} className='text-gray-400 mb-3' />
              <Text c='dimmed' size='sm' className='text-center'>
                {tr.comingSoon}
              </Text>
              <div className='mt-4 text-xs text-gray-500'>
                <p>Today: {stats?.visitsByPeriod?.today || 0}</p>
                <p>Yesterday: {stats?.visitsByPeriod?.yesterday || 0}</p>
                <p>Last Week: {stats?.visitsByPeriod?.lastWeek || 0}</p>
                <p>Last Month: {stats?.visitsByPeriod?.lastMonth || 0}</p>
                <p>Last Year: {stats?.visitsByPeriod?.lastYear || 0}</p>
              </div>
            </div>
          </Card.Section>
        </Card>

        {/* Product Categories Chart Placeholder */}
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Card.Section withBorder inheritPadding py='md'>
            <h3 className='text-lg font-semibold'>{tr.productVisits}</h3>
          </Card.Section>
          <Card.Section inheritPadding py='md'>
            <div className='h-64 flex flex-col items-center justify-center bg-gray-50 rounded'>
              <IconEye size={48} stroke={1.5} className='text-gray-400 mb-3' />
              <Text c='dimmed' size='sm' className='text-center'>
                {tr.comingSoon}
              </Text>
              <div className='mt-4 text-xs text-gray-500 text-center'>
                <p>Chart will display product visit trends</p>
                <p>using Nivo visualization library</p>
              </div>
            </div>
          </Card.Section>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card shadow='sm' padding='lg' radius='md' withBorder className='mt-8'>
        <Card.Section withBorder inheritPadding py='md'>
          <h3 className='text-lg font-semibold'>Recent Activity</h3>
        </Card.Section>
        <Card.Section inheritPadding py='md'>
          <div className='h-40 flex flex-col items-center justify-center bg-gray-50 rounded'>
            <Text c='dimmed' size='sm'>
              {tr.comingSoon}
            </Text>
            <p className='text-xs text-gray-500 mt-2'>Activity log integration coming soon</p>
          </div>
        </Card.Section>
      </Card>
    </div>
  )
}

export default SupplierDashboard
