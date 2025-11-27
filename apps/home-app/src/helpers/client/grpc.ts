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

import { ClientInformation } from '@megacommerce/shared/client'

const usersGrpc = new UsersGrpcWebImpl(process.env['NEXT_PUBLIC_USERS_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const usersClient = new UsersServiceClientImpl(usersGrpc)

// Create a proper transport factory that implements the full Transport interface
function createTransportWithMetadata(clientInfo: ClientInformation): grpc.TransportFactory {
  return (opts: grpc.TransportOptions) => {
    // Create the base transport
    const baseTransport = grpc.CrossBrowserHttpTransport({ withCredentials: true })(opts)

    // Return a new transport that wraps the base one
    return {
      // Preserve all methods from base transport
      ...baseTransport,

      // Override the start method to add metadata
      start: (metadata: grpc.Metadata) => {
        // Add your custom metadata
        metadata.set('x-request-id', crypto.randomUUID())
        metadata.set('accept-language', clientInfo.language)
        metadata.set('x-ip-address', clientInfo.ipAddress ?? '')
        metadata.set('user-agent', clientInfo.userAgent)

        // Call the original start method
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

export function productsClient(clientInfo: ClientInformation): ProductsServiceClientImpl {
  if (_productsClient) return _productsClient

  const endpoint = process.env['NEXT_PUBLIC_PRODUCTS_GRPC_ENDPOINT']
  if (!endpoint) throw new Error('Missing PRODUCTS_GRPC_ENDPOINT')

  const productsGrpc = new ProductsGrpcWebImpl(endpoint, {
    transport: createTransportWithMetadata(clientInfo),
    debug: process.env.NODE_ENV !== 'production',
  })

  _productsClient = new ProductsServiceClientImpl(productsGrpc)
  return _productsClient
}
