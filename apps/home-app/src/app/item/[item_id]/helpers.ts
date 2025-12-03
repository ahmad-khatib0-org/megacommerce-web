import { Status } from '@grpc/grpc-js/build/src/constants'
import {
  ProductDetailsResponse,
  ProductDetailsRequest,
  ProductDetailsResponseData,
} from '@megacommerce/proto/web/products/v1/product_details'
import { getMetadata, grpcCall, isValidUlid, Trans } from '@megacommerce/shared/server'

import { productsClient } from '@/helpers/server'

export const getTrans = (lang: string) => {
  const tr = Trans.tr
  return {
    shipAndReturn: tr(lang, 'shipping.return_and_refund_policy'),
    security: tr(lang, 'shipping.security_and_privacy'),
    soldBy: tr(lang, 'products.sold_by'),
    shipTo: tr(lang, 'location.ship_to'),
    buyNow: tr(lang, 'shipping.buy_now'),
    addToCart: tr(lang, 'products.add_to_cart'),
    returnPolicyDescription: tr(lang, 'shipping.refund_and_return_policy_desc'),
    securityAndPrivacy: tr(lang, 'products.security_and_privacy_desc'),
    commit: tr(lang, 'megacommerce.commitment'),
    freeReturn: tr(lang, 'shipping.free_return'),
    freeShipping: tr(lang, 'shipping.free_shipping'),
    share: tr(lang, 'products.share'),
    addToWishlist: tr(lang, 'products.add_to_wishlist'),
    quantity: tr(lang, 'products.quantity'),
    total: tr(lang, 'cart.total'),
  }
}

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
