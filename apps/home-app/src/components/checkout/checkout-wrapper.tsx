'use client'
import { useCartStore } from '@/store/cart'
import { Button, Title, Text, Divider } from '@mantine/core'
import { IconArrowLeft, IconCreditCard, IconMapPin, IconUser } from '@tabler/icons-react'

function CheckoutWrapper() {
  const { items, total } = useCartStore()

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='lg:w-2/3'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
            <div className='flex items-center gap-2 mb-6'>
              <IconUser size={24} className='text-orange-500' />
              <Title order={2}>Shipping Details</Title>
            </div>

            <form className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name *</label>
                  <input
                    type='text'
                    placeholder='John Doe'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
                  <input
                    type='email'
                    placeholder='john.doe@example.com'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address *</label>
                <input
                  type='text'
                  placeholder='123 Main St'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>City *</label>
                  <input
                    type='text'
                    placeholder='Anytown'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Country *</label>
                  <input
                    type='text'
                    placeholder='USA'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Postal Code *</label>
                  <input
                    type='text'
                    placeholder='12345'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                  />
                </div>
              </div>
            </form>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <IconCreditCard size={24} className='text-orange-500' />
              <Title order={2}>Payment Information</Title>
            </div>
            <Text c='dimmed' mb='md'>
              Secure payment powered by Stripe. Your payment details are encrypted and protected.
            </Text>
            <Button
              fullWidth
              size='lg'
              color='red'
              className='py-3 text-lg font-bold mt-6'
              leftSection={<IconCreditCard size={20} />}>
              Proceed to Payment - ${total.toFixed(2)}
            </Button>

            <Button
              variant='subtle'
              fullWidth
              mt='md'
              leftSection={<IconArrowLeft size={18} />}
              className='text-gray-600'>
              Return to Cart
            </Button>
          </div>
        </div>

        <div className='lg:w-1/3'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-8'>
            <div className='flex items-center gap-2 mb-6'>
              <IconMapPin size={24} className='text-orange-500' />
              <Title order={2}>Order Summary</Title>
            </div>

            <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2'>
              {items.map((item) => (
                <div key={item.id} className='flex gap-3 pb-4 border-b border-gray-100'>
                  {/* Item Image */}
                  <div className='flex-shrink-0'>
                    <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center'>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-cover rounded-lg'
                        />
                      ) : (
                        <div className='text-gray-400 text-xs text-center'>No image</div>
                      )}
                    </div>
                  </div>
                  <div className='flex-1'>
                    <Text fw={500} lineClamp={2} className='mb-1'>
                      {item.name}
                    </Text>
                    <div className='flex justify-between items-end mt-2'>
                      <div className='text-sm text-gray-600'>
                        <div className='flex items-center gap-2'>
                          <span>Quantity: {item.quantity}</span>
                          <span className='text-gray-400'>•</span>
                          <span>${item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <Text fw={600} className='text-orange-500'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Divider my='md' />
            <div className='space-y-3'>
              <div className='flex justify-between text-gray-600'>
                <Text>Subtotal</Text>
                <Text>${total.toFixed(2)}</Text>
              </div>

              <div className='flex justify-between text-gray-600'>
                <Text>Shipping</Text>
                <Text className='text-green-600'>Free</Text>
              </div>
              <div className='flex justify-between text-gray-600'>
                <Text>Tax</Text>
                <Text>Calculated at checkout</Text>
              </div>
              <Divider my='sm' />
              <div className='flex justify-between'>
                <Text size='lg' fw={700}>
                  Total
                </Text>
                <Text size='lg' fw={700} className='text-orange-500'>
                  ${total.toFixed(2)}
                </Text>
              </div>
            </div>
            <div className='mt-6 text-xs text-gray-500'>
              <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutWrapper
