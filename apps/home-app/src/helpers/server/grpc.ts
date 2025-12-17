import 'server-only'
import { credentials } from '@grpc/grpc-js'

import { Common } from '@megacommerce/proto/common/v1'
import { ProductsServiceClient } from '@megacommerce/proto/products/v1/products'

const globalForCommon = globalThis as unknown as {
  commonClient?: Common.CommonServiceClient
}

export function commonClient() {
  if (globalForCommon.commonClient) return globalForCommon.commonClient

  const endpoint = process.env.COMMON_GRPC_ENDPOINT as string
  if (!endpoint) throw new Error('Missing COMMON_GRPC_ENDPOINT')

  let host = endpoint
  if (endpoint.includes('://')) {
    const url = new URL(endpoint)
    host = url.host
  }

  const options = {
    'grpc.keepalive_time_ms': 30000,
    'grpc.keepalive_timeout_ms': 5000,
  }

  globalForCommon.commonClient = new Common.CommonServiceClient(host, credentials.createInsecure(), options)
  return globalForCommon.commonClient
}

const globalForProducts = global as unknown as {
  productsClient?: ProductsServiceClient
}

export function productsClient() {
  if (globalForProducts.productsClient) return globalForProducts.productsClient

  const endpoint = process.env.PRODUCTS_GRPC_ENDPOINT
  if (!endpoint) throw new Error('Missing PRODUCTS_GRPC_ENDPOINT')

  const options = {
    'grpc.keepalive_time_ms': 30000,
    'grpc.keepalive_timeout_ms': 5000,
  }

  globalForProducts.productsClient = new ProductsServiceClient(
    endpoint,
    credentials.createInsecure(),
    options
  )

  return globalForProducts.productsClient
}
