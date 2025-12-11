'use client'
import { useState } from 'react'
import { Button, Text, Title, Badge, Radio, Divider, Modal } from '@mantine/core'
import {
  IconCreditCard,
  IconWallet,
  IconBuildingBank,
  IconCheck,
  IconLock,
  IconShieldCheck,
  IconCalendar,
  IconReceipt,
  IconBrandPaypal,
  IconBrandApple,
  IconBrandGoogle,
} from '@tabler/icons-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple' | 'google'
  lastFour?: string
  name: string
  expiryDate?: string
  isDefault: boolean
  icon: any
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  orderNumber?: string
  paymentMethod: string
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    lastFour: '4242',
    expiryDate: '12/25',
    isDefault: true,
    icon: IconCreditCard,
  },
  {
    id: '2',
    type: 'card',
    name: 'Mastercard ending in 8888',
    lastFour: '8888',
    expiryDate: '08/24',
    isDefault: false,
    icon: IconCreditCard,
  },
  {
    id: '3',
    type: 'paypal',
    name: 'PayPal Account',
    isDefault: false,
    icon: IconBrandPaypal,
  },
  {
    id: '4',
    type: 'apple',
    name: 'Apple Pay',
    isDefault: false,
    icon: IconBrandApple,
  },
  {
    id: '5',
    type: 'google',
    name: 'Google Pay',
    isDefault: false,
    icon: IconBrandGoogle,
  },
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Wireless Headphones & Smart Watch',
    amount: 339.96,
    status: 'completed',
    orderNumber: 'ORD-789456',
    paymentMethod: 'Visa 4242',
  },
  {
    id: '2',
    date: '2024-01-10',
    description: 'USB-C Fast Charger & Phone Case',
    amount: 124.97,
    status: 'completed',
    orderNumber: 'ORD-123456',
    paymentMethod: 'Mastercard 8888',
  },
  {
    id: '3',
    date: '2024-01-08',
    description: 'Annual Membership Fee',
    amount: 99.99,
    status: 'pending',
    paymentMethod: 'PayPal',
  },
  {
    id: '4',
    date: '2024-01-05',
    description: 'Gaming Mouse',
    amount: 89.99,
    status: 'completed',
    orderNumber: 'ORD-654321',
    paymentMethod: 'Apple Pay',
  },
  {
    id: '5',
    date: '2024-01-02',
    description: 'Mechanical Keyboard',
    amount: 149.99,
    status: 'failed',
    orderNumber: 'ORD-987654',
    paymentMethod: 'Google Pay',
  },
]

function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [selectedMethod, setSelectedMethod] = useState<string>('1')
  const [addCardModalOpen, setAddCardModalOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'pending':
        return 'orange'
      case 'failed':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const handleAddCard = () => {
    if (cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvc) {
      const lastFour = cardDetails.number.slice(-4)
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        name: `Visa ending in ${lastFour}`,
        lastFour,
        expiryDate: cardDetails.expiry,
        isDefault: false,
        icon: IconCreditCard,
      }
      setPaymentMethods([...paymentMethods, newCard])
      setCardDetails({ number: '', name: '', expiry: '', cvc: '' })
      setAddCardModalOpen(false)
    }
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    )
    setSelectedMethod(id)
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Title order={1} className='mb-2'>
          Payment Methods
        </Title>
        <Text c='dimmed'>Manage your payment methods and view transaction history</Text>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Left Column - Payment Methods */}
        <div className='lg:w-2/3 space-y-6'>
          {/* Payment Methods List */}
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <IconWallet size={24} className='text-orange-500' />
                <Title order={2}>Saved Payment Methods</Title>
              </div>
              <Badge color='green' variant='light'>
                Secure Payment
              </Badge>
            </div>

            <div className='space-y-4'>
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg transition-all duration-200 ${method.isDefault
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-lg ${method.type === 'card'
                              ? 'bg-blue-50'
                              : method.type === 'paypal'
                                ? 'bg-blue-100'
                                : method.type === 'apple'
                                  ? 'bg-gray-100'
                                  : 'bg-red-50'
                            }`}>
                          <Icon
                            size={24}
                            className={
                              method.type === 'card'
                                ? 'text-blue-600'
                                : method.type === 'paypal'
                                  ? 'text-blue-700'
                                  : method.type === 'apple'
                                    ? 'text-gray-800'
                                    : 'text-red-600'
                            }
                          />
                        </div>

                        <div>
                          <Text fw={500} className='mb-1'>
                            {method.name}
                          </Text>
                          {method.expiryDate && (
                            <Text size='sm' c='dimmed'>
                              Expires {method.expiryDate}
                            </Text>
                          )}
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        {method.isDefault && (
                          <Badge color='orange' variant='light'>
                            Default
                          </Badge>
                        )}

                        <Radio
                          checked={method.isDefault}
                          onChange={() => handleSetDefault(method.id)}
                          label='Default'
                          size='sm'
                        />

                        <Button
                          variant='subtle'
                          color='red'
                          size='xs'
                          disabled={method.isDefault}
                          onClick={() => {
                            if (!method.isDefault) {
                              setPaymentMethods((methods) => methods.filter((m) => m.id !== method.id))
                            }
                          }}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Divider my='xl' />

            {/* Add New Payment Method */}
            <div>
              <Title order={3} className='mb-4'>
                Add New Payment Method
              </Title>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Button
                  variant='outline'
                  className='border-gray-300 h-24 flex flex-col'
                  onClick={() => setAddCardModalOpen(true)}>
                  <IconCreditCard size={32} className='text-gray-600 mb-2' />
                  <Text size='sm'>Credit/Debit Card</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col'>
                  <IconBrandPaypal size={32} className='text-blue-700 mb-2' />
                  <Text size='sm'>PayPal</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col'>
                  <IconBrandApple size={32} className='text-gray-800 mb-2' />
                  <Text size='sm'>Apple Pay</Text>
                </Button>

                <Button variant='outline' className='border-gray-300 h-24 flex flex-col'>
                  <IconBrandGoogle size={32} className='text-red-600 mb-2' />
                  <Text size='sm'>Google Pay</Text>
                </Button>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <IconShieldCheck size={24} className='text-green-500' />
              <Title order={2}>Payment Security</Title>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex gap-3'>
                <IconLock size={20} className='text-green-500 mt-1 flex-shrink-0' />
                <div>
                  <Text fw={500} className='mb-1'>
                    SSL Encryption
                  </Text>
                  <Text size='sm' c='dimmed'>
                    All your payment details are encrypted with 256-bit SSL security
                  </Text>
                </div>
              </div>

              <div className='flex gap-3'>
                <IconCheck size={20} className='text-green-500 mt-1 flex-shrink-0' />
                <div>
                  <Text fw={500} className='mb-1'>
                    PCI Compliant
                  </Text>
                  <Text size='sm' c='dimmed'>
                    We are fully PCI DSS compliant to ensure your data safety
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div className='lg:w-1/3'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-8'>
            <div className='flex items-center gap-2 mb-6'>
              <IconReceipt size={24} className='text-orange-500' />
              <Title order={2}>Recent Transactions</Title>
            </div>

            <div className='space-y-4 max-h-[500px] overflow-y-auto pr-2'>
              {transactions.map((transaction) => (
                <div key={transaction.id} className='pb-4 border-b border-gray-100 last:border-0'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <Text fw={500} lineClamp={1} className='mb-1'>
                        {transaction.description}
                      </Text>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <IconCalendar size={14} />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.orderNumber && (
                          <>
                            <span className='text-gray-400'>•</span>
                            <span>{transaction.orderNumber}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Badge color={getStatusColor(transaction.status)} variant='light' size='sm'>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </div>

                  <div className='flex justify-between items-center'>
                    <Text size='sm' c='dimmed' className='flex items-center gap-1'>
                      <IconBuildingBank size={14} />
                      {transaction.paymentMethod}
                    </Text>

                    <Text fw={600} className={transaction.amount > 0 ? 'text-red-500' : 'text-green-500'}>
                      {transaction.amount > 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            <Divider my='md' />

            <div className='space-y-3'>
              <div className='flex justify-between'>
                <Text c='dimmed'>Total Spent (30 days)</Text>
                <Text fw={600} className='text-red-500'>
                  -$
                  {transactions
                    .filter((t) => t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </Text>
              </div>

              <div className='flex justify-between'>
                <Text c='dimmed'>Pending Charges</Text>
                <Text fw={600} className='text-orange-500'>
                  -$
                  {transactions
                    .filter((t) => t.status === 'pending')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </Text>
              </div>
            </div>

            <Button fullWidth variant='outline' color='gray' mt='md' size='sm'>
              View All Transactions
            </Button>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      <Modal
        opened={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        title='Add New Card'
        size='lg'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Card Number *</label>
            <input
              type='text'
              placeholder='4242 4242 4242 4242'
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Cardholder Name *</label>
            <input
              type='text'
              placeholder='John Doe'
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Expiry Date (MM/YY) *</label>
              <input
                type='text'
                placeholder='12/25'
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>CVC *</label>
              <input
                type='text'
                placeholder='123'
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              />
            </div>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-600 mt-4'>
            <IconLock size={16} className='text-green-500' />
            <Text size='sm'>Your card details are encrypted and secure</Text>
          </div>

          <div className='flex gap-3 mt-6'>
            <Button fullWidth variant='outline' onClick={() => setAddCardModalOpen(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              color='red'
              onClick={handleAddCard}
              disabled={!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc}>
              Add Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PaymentsPage
