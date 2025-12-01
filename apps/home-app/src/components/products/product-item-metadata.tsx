import Image from 'next/image'
import {
  ProductItemMetadata as ProductItemMetadataEnum,
  ProductItemMetadataType,
} from '@megacommerce/proto/web/products/v1/products_to_like'

import { Assets } from '@/helpers/shared'
import { IconArrowRight } from '@tabler/icons-react'

type Props = {
  meta: ProductItemMetadataEnum
}

function ProductItemMetadata({ meta }: Props) {
  switch (meta.type) {
    case ProductItemMetadataType.PRODUCT_ITEM_METADATA_TYPE_COUPON:
      return (
        <div className='flex items-center gap-x-1 px-1'>
          <Image
            src={Assets.percentage}
            alt='percentage'
            sizes='16px'
            width={16}
            height={16}
            className='object-fill'
          />
          <p className='text-red-400'>{meta.label}</p>
        </div>
      )
    case ProductItemMetadataType.PRODUCT_ITEM_METADATA_TYPE_BUNDLE:
      return (
        <div className='flex items-center gap-x-1 px-1'>
          <p className='font-light'>{meta.label}</p>
          <IconArrowRight size={20} />
        </div>
      )
    case ProductItemMetadataType.PRODUCT_ITEM_METADATA_TYPE_NEW_SHOPPER:
      return (
        <div className='flex items-center gap-x-1 px-1'>
          <Image
            src={Assets.arrowDown}
            alt={meta.label}
            sizes='16px'
            width={16}
            height={16}
            className='object-fill'
          />
          <p className='text-red-400'>{meta.label}</p>
        </div>
      )
  }
}

export default ProductItemMetadata
