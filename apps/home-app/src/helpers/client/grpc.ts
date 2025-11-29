import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'

import {
  GrpcWebImpl as UsersGrpcWebImpl,
  UsersServiceClientImpl,
} from '@megacommerce/proto/web/users/v1/users'
import {
  GrpcWebImpl as ProductsGrpcWebImpl,
  ProductsServiceClientImpl,
} from '@megacommerce/proto/web/products/v1/products'

import { ClientInformation, trackClient } from '@megacommerce/shared/client'

const usersGrpc = new UsersGrpcWebImpl(process.env['NEXT_PUBLIC_USERS_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const usersClient = new UsersServiceClientImpl(usersGrpc)

let clientInformation: ClientInformation | null

// Create a proper transport factory that implements the full Transport interface
async function createTransportWithMetadata(): Promise<grpc.TransportFactory> {
  if (!clientInformation) {
    try {
      // const options = { enableFingerprinting: true, enableGeoIP: true, timeout: 3000 }
      const options = { enableFingerprinting: true, timeout: 3000 }
      clientInformation = await trackClient({}, options)
    } catch (err) {
      console.error(err)
    }
  }

  return (opts: grpc.TransportOptions) => {
    const baseTransport = grpc.CrossBrowserHttpTransport({ withCredentials: true })(opts)
    return {
      ...baseTransport,

      start: (metadata: grpc.Metadata) => {
        metadata.set('x-request-id', crypto.randomUUID())
        metadata.set('accept-language', clientInformation?.language ?? '')
        metadata.set('x-ip-address', clientInformation?.ipAddress ?? '')
        metadata.set('user-agent', clientInformation?.userAgent ?? '')
        metadata.set('x-timezone', clientInformation?.timezone ?? '')

        return baseTransport.start(metadata)
      },

      // Explicitly ensure all required methods are present
      sendMessage: baseTransport.sendMessage?.bind(baseTransport),
      finishSend: baseTransport.finishSend?.bind(baseTransport),
      cancel: baseTransport.cancel?.bind(baseTransport),
    }
  }
}

let _productsClient: ProductsServiceClientImpl | null = null

export async function productsClient(): Promise<ProductsServiceClientImpl> {
  if (_productsClient) return _productsClient

  const endpoint = process.env['NEXT_PUBLIC_PRODUCTS_GRPC_ENDPOINT']
  if (!endpoint) throw new Error('Missing PRODUCTS_GRPC_ENDPOINT')

  const productsGrpc = new ProductsGrpcWebImpl(endpoint, {
    transport: await createTransportWithMetadata(),
    debug: process.env.NODE_ENV !== 'production',
  })

  _productsClient = new ProductsServiceClientImpl(productsGrpc)
  return _productsClient
}
