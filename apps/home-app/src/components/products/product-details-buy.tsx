'use client'
import { useState } from 'react'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Button, Input, Tooltip, Badge } from '@mantine/core'
import { IconHeart, IconShare, IconShieldCheck, IconTruck, IconRotate2 } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'

type Props = {
  soldBy: string
  shipTo: string
  shippingPrice: number
  deliveryDate: string
  tr: ObjString
  price: number
  originalPrice?: number
  discount?: number
  currency: string
}

function ProductDetailsBuy({
  soldBy,
  shipTo,
  shippingPrice,
  deliveryDate,
  tr,
  price,
  originalPrice,
  discount,
  currency,
}: Props) {
  const [quantity, setQuantity] = useState(1)
  const [returnsModalOpened, { open: openReturns, close: closeReturns }] = useDisclosure(false)
  const [securityModalOpened, { open: openSecurity, close: closeSecurity }] = useDisclosure(false)

  const totalPrice = (price * quantity).toFixed(2)

  return (
    <div className='border border-gray-200 rounded-lg p-4 shadow-sm bg-white'>
      <div className='mb-4'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='text-2xl font-bold text-red-600'>
            {currency}
            {price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className='text-lg text-gray-500 line-through'>
              {currency}
              {originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <Badge color='red' variant='filled' size='lg'>
              -{discount}%
            </Badge>
          )}
        </div>
        <p className='text-green-600 text-sm font-medium'>{tr.freeShipping || 'Free Shipping'}</p>
      </div>

      <div className='mb-4 space-y-2 text-sm'>
        <div className='flex'>
          <span className='text-gray-600 w-24 shrink-0'>{tr.soldBy}:</span>
          <span className='font-medium truncate'>{soldBy}</span>
        </div>
        <div className='flex'>
          <span className='text-gray-600 w-24 shrink-0'>{tr.shipTo}:</span>
          <span className='font-medium truncate'>{shipTo}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconTruck size={18} className='text-gray-500' />
          <span className='text-gray-600'>{tr.delivery}:</span>
          <span className='font-medium'>{deliveryDate}</span>
          {shippingPrice === 0 ? (
            <Badge color='green' size='sm' variant='light'>
              {tr.freeShipping}
            </Badge>
          ) : (
            <span>${shippingPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className='mb-6 border-t border-b border-gray-100 py-3'>
        <h3 className='font-bold text-base mb-3 flex items-center gap-2'>
          <IconShieldCheck size={20} className='text-red-500' />
          {tr.commit}
        </h3>

        <div className='space-y-2'>
          <div
            onClick={openReturns}
            className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer'>
            <div className='size-8 bg-green-100 rounded-full flex items-center justify-center'>
              <IconRotate2 size={18} className='text-green-600' />
            </div>
            <div className='flex-1'>
              <p className='font-medium text-gray-800'>{tr.shipAndReturn}</p>
              <p className='text-sm text-gray-600'>{tr.freeReturns || 'Free returns within 15 days'}</p>
            </div>
          </div>

          <div
            onClick={openSecurity}
            className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer'>
            <div className='size-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <IconShieldCheck size={18} className='text-blue-600' />
            </div>
            <div className='flex-1'>
              <p className='font-medium text-gray-800'>{tr.security}</p>
              <p className='text-sm text-gray-600'>{tr.securePayment || 'Secure payment & privacy'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <p className='text-gray-600 mb-2'>{tr.quantity}:</p>
        <div className='flex items-center border border-gray-300 rounded w-fit'>
          <Button
            variant='subtle'
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className='border-0'>
            −
          </Button>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className='w-16 text-center border-0 [&_input]:text-center'
            size='md'
          />
          <Button variant='subtle' onClick={() => setQuantity(quantity + 1)} className='border-0'>
            +
          </Button>
        </div>
        <p className='text-sm text-gray-500 mt-2'>
          {quantity} {tr.items} · {tr.total}:{' '}
          <span className='font-bold'>
            {currency} {totalPrice}
          </span>
        </p>
      </div>

      <div className='space-y-3 mb-4'>
        <Button fullWidth size='lg' className='bg-red-500 hover:bg-red-600 h-12 text-lg font-bold'>
          {tr.buyNow}
        </Button>
        <Button
          fullWidth
          size='lg'
          variant='outline'
          className='border-orange-500 text-orange-500 hover:bg-orange-50 h-12'>
          {tr.addToCart}
        </Button>
      </div>

      <div className='flex items-center justify-center gap-4 pt-3 border-t border-gray-100'>
        <Tooltip label={tr.share}>
          <Button variant='subtle' size='sm' leftSection={<IconShare size={18} />}>
            {tr.share}
          </Button>
        </Tooltip>
        <Tooltip label={tr.addToWishlist}>
          <Button variant='subtle' size='sm' leftSection={<IconHeart size={18} />}>
            {tr.addToWishlist}
          </Button>
        </Tooltip>
      </div>

      <Modal opened={returnsModalOpened} onClose={closeReturns} title={tr.returnPolicy}>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <IconRotate2 size={24} className='text-green-600' />
            <div>
              <h4 className='font-bold'>{tr.shipAndReturn}</h4>
              <p className='text-sm text-gray-600'>{tr.freeReturns || 'Free returns within 15 days'}</p>
            </div>
          </div>
          <p className='text-gray-700'>{tr.returnPolicyDescription}</p>
        </div>
      </Modal>

      <Modal opened={securityModalOpened} onClose={closeSecurity} title={tr.security}>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <IconShieldCheck size={24} className='text-blue-600' />
            <div>
              <h4 className='font-bold'>{tr.securityAndPrivacy}</h4>
              <p className='text-sm text-gray-600'>Your data is protected</p>
            </div>
          </div>
          <p className='text-gray-700'>{tr.securityAndPrivacyDescription}</p>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetailsBuy
