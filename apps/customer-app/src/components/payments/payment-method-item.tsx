'use client'

import { PaymentMethod } from '@megacommerce/proto/orders/v1/payment_method'
import { Button, Badge, Radio, Text } from '@mantine/core'
import {
  IconCreditCard,
  IconBrandPaypal,
  IconBrandApple,
  IconBrandGoogle,
} from '@tabler/icons-react'
import { getPaymentMethodBackground, getPaymentMethodIconColor } from './helpers'

type Props = {
  method: PaymentMethod
  onSetDefault: (id: string) => void
  onRemove: (id: string) => void
  tr: Record<string, string>
  isLoading?: boolean
}

function PaymentMethodItem({ method, onSetDefault, onRemove, tr, isLoading = false }: Props) {
  const getIcon = () => {
    switch (method.type) {
      case 'card':
        return IconCreditCard
      case 'paypal':
        return IconBrandPaypal
      case 'apple':
        return IconBrandApple
      case 'google':
        return IconBrandGoogle
      default:
        return IconCreditCard
    }
  }

  const Icon = getIcon()

  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-200 ${
        method.isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
      }`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className={`p-2 rounded-lg ${getPaymentMethodBackground(method.type)}`}>
            <Icon size={24} className={getPaymentMethodIconColor(method.type)} />
          </div>

          <div>
            <Text fw={500} className='mb-1'>
              {method.name}
            </Text>
            {method.expiryDate && (
              <Text size='sm' c='dimmed'>
                {tr.expires} {method.expiryDate}
              </Text>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {method.isDefault && (
            <Badge color='orange' variant='light'>
              {tr.default}
            </Badge>
          )}

          <Radio
            checked={method.isDefault}
            onChange={() => onSetDefault(method.id)}
            label={tr.default}
            size='sm'
            disabled={isLoading}
          />

          <Button
            variant='subtle'
            color='red'
            size='xs'
            disabled={method.isDefault || isLoading}
            onClick={() => onRemove(method.id)}>
            {tr.remove}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodItem
