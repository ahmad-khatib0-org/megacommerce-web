import { RefObject } from 'react'
import { UseFormReturnType } from '@mantine/form'

import { ObjString } from '@megacommerce/shared'

import ProductCreateDetailsWithoutVariations from '@/components/products/create/product-create-details-without-variations'
import ProductCreateDetailsWithVariations, {
  ProductCreateDetailsWithVariationsForm,
} from '@/components/products/create/product-create-details-with-variations'
import { useProductsStore } from '@/store'

type Props = {
  tr: ObjString
  lang: string
  hasVariations: boolean
  reference: RefObject<ProductCreateDetailsHandlers | null>
}

export type ProductCreateDetailsHandlers = {
  getForm: () => UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>
  getVariationsForm?: () => ProductCreateDetailsWithVariationsForm
}

const ProductCreateDetails = ({ tr, lang, hasVariations, reference }: Props) => {
  const productDetailsData = useProductsStore((state) => state.product_details_data)

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
