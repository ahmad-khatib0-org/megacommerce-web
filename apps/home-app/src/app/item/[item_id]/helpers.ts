import { Status } from '@grpc/grpc-js/build/src/constants'
import {
  ProductDetailsResponse,
  ProductDetailsRequest,
  ProductDetailsResponseData,
} from '@megacommerce/proto/web/products/v1/product_details'
import { ProductDetails } from '@megacommerce/proto/products/v1/product'
import { getMetadata, grpcCall, isValidUlid, Trans } from '@megacommerce/shared/server'

import { AppData, productsClient } from '@/helpers/server'
import { fromAnyGrpc } from '@megacommerce/shared'

export const getTrans = (lang: string) => {
  const tr = Trans.tr
  return {
    shipAndReturn: tr(lang, 'shipping.return_and_refund_policy'),
    security: tr(lang, 'shipping.security_and_privacy'),
    proteced: tr(lang, 'privacy.protected'),
    taxAt: tr(lang, 'payment.tax.caculated_at_checkout'),
    soldBy: tr(lang, 'products.sold_by'),
    shipTo: tr(lang, 'location.ship_to'),
    shippingCost: tr(lang, 'shipping.cost'),
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
    ratingAndReviews: tr(lang, 'reviews.rating_and_reviews'),
    reviews: tr(lang, 'reviews.reviews'),
    ratings: tr(lang, 'reviews.ratings'),
    stars: tr(lang, 'reviews.stars'),
    rating: tr(lang, 'reviews.rating'),
    sort: tr(lang, 'reviews.sort'),
    latest: tr(lang, 'reviews.latest'),
    highest: tr(lang, 'reviews.highest'),
    withPictures: tr(lang, 'reviews.with_pictures'),
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

export const deserializeDetails = async (
  details: ProductDetails,
  lang: string,
  category: string,
  subcategory: string
) => {
  const trans = AppData.instance()
    .categories.find((cat) => cat.id === category)!
    .translations.find((trans) => trans.language === lang)!.subcategories[subcategory]!

  let variants: {
    shared: Record<string, any>
    details: Record<string, { variantName: string; variantData: Record<string, any> }>
  } = { shared: {}, details: {} }

  for (const [fieldName, fieldData] of Object.entries(details.shared)) {
    if (trans.attributes[fieldName]) {
      variants.shared[fieldName] = fromAnyGrpc(fieldData)
    }
  }

  for (const [variantId, variantData] of Object.entries(details.details)) {
    const result: Record<string, any> = {}
    for (const [fieldName, fieldData] of Object.entries(variantData.variantData)) {
      if (trans.attributes[fieldName]) {
        result[fieldName] = fromAnyGrpc(fieldData)
      }
    }
    variants.details[variantId] = { variantName: variantData.variantName, variantData: result }
  }

  return variants
}
