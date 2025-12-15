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
import {
  GrpcWebImpl as InventoryGrpcWebImpl,
  InventoryServiceClientImpl,
} from '@megacommerce/proto/web/inventory/v1/inventory'

import { ClientInformation, trackClient } from '@megacommerce/shared/client'

let clientInformation: ClientInformation | null = null

// Create a proper transport factory that implements the full Transport interface
async function createTransportWithMetadata(): Promise<grpc.TransportFactory> {
  if (!clientInformation) {
    try {
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

let _usersClient: UsersServiceClientImpl | null = null

export async function usersClient(): Promise<UsersServiceClientImpl> {
  if (_usersClient) return _usersClient

  const endpoint = process.env['NEXT_PUBLIC_USERS_GRPC_ENDPOINT']
  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_USERS_GRPC_ENDPOINT environment variable')
  }

  // Create transport with auth metadata instead of CrossBrowserHttpTransport
  const transport = await createTransportWithMetadata()

  const usersGrpc = new UsersGrpcWebImpl(endpoint, {
    transport,
    debug: process.env.NODE_ENV !== 'production',
  })

  _usersClient = new UsersServiceClientImpl(usersGrpc)
  return _usersClient
}

let _productsClient: ProductsServiceClientImpl | null = null

export async function productsClient(): Promise<ProductsServiceClientImpl> {
  if (_productsClient) return _productsClient

  const endpoint = process.env['NEXT_PUBLIC_PRODUCTS_GRPC_ENDPOINT']
  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_PRODUCTS_GRPC_ENDPOINT environment variable')
  }

  // Create transport with auth metadata instead of CrossBrowserHttpTransport
  const transport = await createTransportWithMetadata()

  const productsGrpc = new ProductsGrpcWebImpl(endpoint, {
    transport,
    debug: process.env.NODE_ENV !== 'production',
  })

  _productsClient = new ProductsServiceClientImpl(productsGrpc)
  return _productsClient
}

let _inventoryClient: InventoryServiceClientImpl | null = null

export async function inventoryClient(): Promise<InventoryServiceClientImpl> {
  if (_inventoryClient) return _inventoryClient

  const endpoint = process.env['NEXT_PUBLIC_INVENTORY_GRPC_ENDPOINT']
  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_INVENTORY_GRPC_ENDPOINT environment variable')
  }

  // Create transport with auth metadata
  const transport = await createTransportWithMetadata()

  const inventoryGrpc = new InventoryGrpcWebImpl(endpoint, {
    transport,
    debug: process.env.NODE_ENV !== 'production',
  })

  // Initialize and cache the client
  _inventoryClient = new InventoryServiceClientImpl(inventoryGrpc)
  return _inventoryClient
}
