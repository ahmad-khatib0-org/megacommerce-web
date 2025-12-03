import { Status } from '@grpc/grpc-js/build/src/constants'
import {
  ProductDetailsResponse,
  ProductDetailsRequest,
  ProductDetailsResponseData,
} from '@megacommerce/proto/web/products/v1/product_details'
import { getMetadata, grpcCall, isValidUlid, Trans } from '@megacommerce/shared/server'

import { productsClient } from '@/helpers/server'

export async function getProduct(
  lang: string,
  productId: string
): Promise<ProductDetailsResponseData | { err: string; notFound: boolean }> {
  const tr = Trans.tr

  if (!isValidUlid(productId)) {
    return { err: tr(lang, 'products.not_found.error'), notFound: true }
  }

  const client = productsClient()
  const metadata = await getMetadata()
  const { data, error } = await grpcCall<ProductDetailsRequest, ProductDetailsResponse>(
    client.productDetails.bind(client),
    { productId },
    metadata
  )

  if (error)
    return {
      err:
        error.code === Status.NOT_FOUND ? tr(lang, 'products.not_found.error') : tr(lang, 'error.internal'),
      notFound: error.code === Status.NOT_FOUND,
    }

  if (!data || !data.data) return { err: tr(lang, 'error.internal'), notFound: false }
  if (data.error) {
    return { err: data.error.message, notFound: data.error.statusCode === Status.NOT_FOUND }
  }

  return data.data!
}
