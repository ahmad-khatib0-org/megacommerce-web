import { Button } from '@mantine/core'
import { IconBuildingFactory2, IconMessages, IconStarFilled } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'

type BrandInfoProps = {
  brandName: string
  storeLink: string
  followers: number
  positiveFeedbackRate: number
  tr: ObjString
}

function ProductDetailsBrandInfo({
  brandName,
  storeLink,
  followers,
  positiveFeedbackRate,
  tr,
}: BrandInfoProps) {
  const mockBrandName = 'Official Mega Store'
  const mockFollowers = 150000
  const mockPositiveFeedbackRate = 98.7

  const effectiveBrandName = brandName || mockBrandName
  const effectiveFollowers = followers || mockFollowers
  const effectivePositiveFeedbackRate = positiveFeedbackRate || mockPositiveFeedbackRate

  return (
    <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm my-8'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-bold text-gray-800'>{effectiveBrandName}</h3>
        <Button
          variant='outline'
          size='sm'
          leftSection={<IconMessages size={18} />}
          className='border-orange-500 text-orange-500 hover:bg-orange-50'>
          {tr.contactSeller}
        </Button>
      </div>

      <div className='flex items-center gap-6 mb-4 text-sm text-gray-600'>
        <div className='flex items-center gap-1'>
          <IconStarFilled size={18} className='text-yellow-400' />
          <span>
            {effectivePositiveFeedbackRate}% {tr.positiveFeedback}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <p className='font-bold text-gray-800'>{effectiveFollowers.toLocaleString()}</p>
          <p>{tr.followers}</p>
        </div>
      </div>
      <Button
        fullWidth
        variant='filled'
        color='red'
        size='sm'
        leftSection={<IconBuildingFactory2 size={20} />}
        className='py-1 px-12 text-lg font-bold w-max'
        component='a'
        href={storeLink}>
        {tr.visitStore}
      </Button>
    </div>
  )
}

export default ProductDetailsBrandInfo
