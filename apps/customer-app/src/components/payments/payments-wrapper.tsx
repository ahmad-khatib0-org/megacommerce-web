'use client'

import { useEffect, useState } from 'react'
import { Button, Text, Title, Badge, Divider } from '@mantine/core'
import {
  IconWallet,
  IconCreditCard,
  IconBrandPaypal,
  IconBrandApple,
  IconBrandGoogle,
  IconShieldCheck,
  IconLock,
  IconCheck,
} from '@tabler/icons-react'
import { PaymentMethod } from '@megacommerce/proto/orders/v1/payment_method'
import { ObjString } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { ordersClient } from '@/helpers/client'
import { useAppStore } from '@/store'
import PaymentMethodItem from './payment-method-item'
import AddPaymentModal, { CardDetails } from './add-payment-modal'
import { checkDuplicatePaymentMethod } from './helpers'

type Props = {
  tr: ObjString
}

function PaymentsWrapper({ tr }: Props) {
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [showDuplicateError, setShowDuplicateError] = useState(false)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    setLoading(true)
    try {
      const res = await (await ordersClient()).PaymentsList({})
      if (res.error) {
        console.error('Failed to fetch payment methods:', res.error.message)
      } else if (res.data) {
        setPaymentMethods(res.data.paymentMethods || [])
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async (cardDetails: CardDetails) => {
    const lastFour = cardDetails.number.slice(-4)

    // Check for duplicates
    if (checkDuplicatePaymentMethod(paymentMethods, lastFour, 'card')) {
      setShowDuplicateError(true)
      setTimeout(() => setShowDuplicateError(false), 3000)
      return
    }

    setOperationLoading(true)
    try {
      const res = await (
        await ordersClient()
      ).PaymentAddMethod({
        type: 'card',
        name: cardDetails.name,
        lastFour,
        expiryDate: cardDetails.expiry,
        token: cardDetails.number,
      })
      if (res.error) {
        console.error('Failed to add payment method:', res.error.message)
      } else if (res.data) {
        setAddModalOpen(false)
        await fetchPaymentMethods()
      }
    } catch (err) {
      console.error('Failed to add payment method:', handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setOperationLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setOperationLoading(true)
    try {
      const res = await (await ordersClient()).PaymentMakeDefault({ paymentMethodId: id })
      if (res.error) {
        console.error('Failed to set default payment method:', res.error.message)
      } else if (res.data) {
        await fetchPaymentMethods()
      }
    } catch (err) {
      console.error('Failed to set default payment method:', handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setOperationLoading(false)
    }
  }

  const handleRemovePayment = async (id: string) => {
    setOperationLoading(true)
    try {
      const res = await (await ordersClient()).PaymentRemoveMethod({ paymentMethodId: id })
      if (res.error) {
        console.error('Failed to remove payment method:', res.error.message)
      } else if (res.data) {
        await fetchPaymentMethods()
      }
    } catch (err) {
      console.error('Failed to remove payment method:', handleGrpcWebErr(err, clientInfo.language))
    } finally {
      setOperationLoading(false)
    }
  }

  return (
    <>
      <div className='w-full mx-auto px-4 py-8'>
        <div className='mb-8'>
          <Title order={1} className='mb-2'>
            {tr.title}
          </Title>
          <Text c='dimmed'>{tr.subtitle}</Text>
        </div>

        <div className='space-y-6'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <IconWallet size={24} className='text-orange-500' />
                <Title order={2}>{tr.savedPaymentMethods}</Title>
              </div>
              <Badge color='green' variant='light'>
                {tr.securePayment}
              </Badge>
            </div>

            {paymentMethods.length > 0 ? (
              <div className='space-y-4 mb-6'>
                {paymentMethods.map((method) => (
                  <PaymentMethodItem
                    key={method.id}
                    method={method}
                    onSetDefault={handleSetDefault}
                    onRemove={handleRemovePayment}
                    tr={tr}
                    isLoading={operationLoading}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <Text c='dimmed'>{tr.noPaymentMethodsAdded || 'No payment methods added yet'}</Text>
              </div>
            )}

            <Divider my='xl' />

            <div>
              <Title order={3} className='mb-4'>
                {tr.addNewPaymentMethod}
              </Title>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Button
                  variant='outline'
                  className='border-gray-300 h-24 flex flex-col'
                  onClick={() => setAddModalOpen(true)}
                  disabled={operationLoading}>
                  <IconCreditCard size={32} className='text-gray-600 mb-2' />
                  <Text size='sm'>{tr.creditDebitCard}</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col' disabled>
                  <IconBrandPaypal size={32} className='text-blue-700 mb-2' />
                  <Text size='sm'>{tr.paypal}</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col' disabled>
                  <IconBrandApple size={32} className='text-gray-800 mb-2' />
                  <Text size='sm'>{tr.applePay}</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col' disabled>
                  <IconBrandGoogle size={32} className='text-red-600 mb-2' />
                  <Text size='sm'>{tr.googlePay}</Text>
                </Button>
              </div>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <IconShieldCheck size={24} className='text-green-500' />
              <Title order={2}>{tr.paymentSecurity}</Title>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex gap-3'>
                <IconLock size={20} className='text-green-500 mt-1 flex-shrink-0' />
                <div>
                  <Text fw={500} className='mb-1'>
                    {tr.sslEncryption}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    {tr.sslEncryptionDesc}
                  </Text>
                </div>
              </div>

              <div className='flex gap-3'>
                <IconCheck size={20} className='text-green-500 mt-1 flex-shrink-0' />
                <div>
                  <Text fw={500} className='mb-1'>
                    {tr.pciCompliant}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    {tr.pciCompliantDesc}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPaymentModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPayment}
        isLoading={operationLoading}
        tr={tr}
        showDuplicateError={showDuplicateError}
      />
    </>
  )
}

export default PaymentsWrapper
