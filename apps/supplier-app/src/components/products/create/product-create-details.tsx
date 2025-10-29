import { RefObject } from 'react'
import { UseFormReturnType } from '@mantine/form'

import { ObjString } from '@megacommerce/shared'

import ProductCreateDetailsWithoutVariations from '@/components/products/create/product-create-details-without-variations'
import ProductCreateDetailsWithVariations, {
  ProductVariationsForm,
} from '@/components/products/create/product-create-details-with-variations'
import { useAppStore, useProductsStore } from '@/store'

type Props = {
  tr: ObjString
  hasVariations: boolean
  reference: RefObject<ProductCreateDetailsHandlers | null>
}

type FormType = UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>
export type ProductCreateDetailsHandlers = {
  getForm: () => FormType
  getVariationsForm?: () => ProductVariationsForm
}

const ProductCreateDetails = ({ tr, hasVariations, reference }: Props) => {
  const productDetailsData = useProductsStore((state) => state.product_details_data)
  const lang = useAppStore((state) => state.clientInfo.language)

  if (!productDetailsData) return null

  return (
    <div className='relative flex flex-col gap-y-4 w-full max-w-[800px] overflow-y-auto'>
      {!hasVariations && (
        <ProductCreateDetailsWithoutVariations
          ref={reference}
          tr={tr}
          productDetailsData={productDetailsData}
          lang={lang}
        />
      )}
      {hasVariations && (
        <ProductCreateDetailsWithVariations
          ref={reference}
          tr={tr}
          productDetailsData={productDetailsData}
          lang={lang}
        />
      )}
    </div>
  )
}

export default ProductCreateDetails
