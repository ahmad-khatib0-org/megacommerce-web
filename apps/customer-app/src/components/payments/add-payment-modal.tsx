'use client'

import { useState } from 'react'
import { Modal, Button, Text, Group } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import { validateCardNumber, validateExpiry, validateCVC } from './helpers'

type Props = {
  opened: boolean
  onClose: () => void
  onAdd: (cardDetails: CardDetails) => Promise<void>
  isLoading?: boolean
  tr: Record<string, string>
  showDuplicateError?: boolean
}

export type CardDetails = {
  number: string
  name: string
  expiry: string
  cvc: string
}

function AddPaymentModal({
  opened,
  onClose,
  onAdd,
  isLoading = false,
  tr,
  showDuplicateError = false,
}: Props) {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })
  const [errors, setErrors] = useState<Partial<CardDetails>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CardDetails> = {}

    if (!cardDetails.number || !validateCardNumber(cardDetails.number)) {
      newErrors.number = 'Invalid card number'
    }
    if (!cardDetails.name || cardDetails.name.trim().length < 3) {
      newErrors.name = 'Invalid cardholder name'
    }
    if (!cardDetails.expiry || !validateExpiry(cardDetails.expiry)) {
      newErrors.expiry = 'Invalid expiry date (use MM/YY)'
    }
    if (!cardDetails.cvc || !validateCVC(cardDetails.cvc)) {
      newErrors.cvc = 'Invalid CVC'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCard = async () => {
    if (!validateForm()) return
    await onAdd(cardDetails)
    setCardDetails({ number: '', name: '', expiry: '', cvc: '' })
    setErrors({})
  }

  const handleClose = () => {
    setCardDetails({ number: '', name: '', expiry: '', cvc: '' })
    setErrors({})
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleClose} title={tr.addNewCard} size='lg'>
      <div className='space-y-4'>
        {showDuplicateError && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <Text size='sm' c='red'>
              This payment method already exists
            </Text>
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {tr.cardNumber} *
          </label>
          <input
            type='text'
            placeholder='4242 4242 4242 4242'
            value={cardDetails.number}
            onChange={(e) => {
              setCardDetails({ ...cardDetails, number: e.target.value })
              if (errors.number) setErrors({ ...errors, number: undefined })
            }}
            disabled={isLoading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
              errors.number ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.number && <Text size='xs' c='red' mt='xs'>{errors.number}</Text>}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {tr.cardholderName} *
          </label>
          <input
            type='text'
            placeholder='John Doe'
            value={cardDetails.name}
            onChange={(e) => {
              setCardDetails({ ...cardDetails, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            disabled={isLoading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <Text size='xs' c='red' mt='xs'>{errors.name}</Text>}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {tr.expiryDate} *
            </label>
            <input
              type='text'
              placeholder='12/25'
              value={cardDetails.expiry}
              onChange={(e) => {
                setCardDetails({ ...cardDetails, expiry: e.target.value })
                if (errors.expiry) setErrors({ ...errors, expiry: undefined })
              }}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                errors.expiry ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.expiry && <Text size='xs' c='red' mt='xs'>{errors.expiry}</Text>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {tr.cvc} *
            </label>
            <input
              type='text'
              placeholder='123'
              value={cardDetails.cvc}
              onChange={(e) => {
                setCardDetails({ ...cardDetails, cvc: e.target.value })
                if (errors.cvc) setErrors({ ...errors, cvc: undefined })
              }}
              disabled={isLoading}
              maxLength={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                errors.cvc ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.cvc && <Text size='xs' c='red' mt='xs'>{errors.cvc}</Text>}
          </div>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-600 mt-4'>
          <IconLock size={16} className='text-green-500' />
          <Text size='sm'>{tr.cardDetailsEncrypted}</Text>
        </div>

        <Group justify='flex-end' mt='lg'>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            {tr.cancel}
          </Button>
          <Button color='orange' onClick={handleAddCard} loading={isLoading}>
            {tr.addCard}
          </Button>
        </Group>
      </div>
    </Modal>
  )
}

export default AddPaymentModal
