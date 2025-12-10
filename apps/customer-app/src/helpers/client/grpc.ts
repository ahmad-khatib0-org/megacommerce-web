import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'
import { GrpcWebImpl, UsersServiceClientImpl } from '@megacommerce/proto/web/users/v1/users'
import { GrpcWebImpl as OrdersGrpcWebImpl, OrdersServiceClientImpl } from '@megacommerce/proto/web/orders/v1/orders'
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
  if (!endpoint) throw new Error('Missing NEXT_PUBLIC_USERS_GRPC_ENDPOINT')

  const usersGrpc = new GrpcWebImpl(endpoint, {
    transport: await createTransportWithMetadata(),
    debug: process.env.NODE_ENV !== 'production',
  })

  _usersClient = new UsersServiceClientImpl(usersGrpc)
  return _usersClient
}

let _ordersClient: OrdersServiceClientImpl | null = null

export async function ordersClient(): Promise<OrdersServiceClientImpl> {
  if (_ordersClient) return _ordersClient

  const endpoint = process.env['NEXT_PUBLIC_ORDERS_GRPC_ENDPOINT']
  if (!endpoint) throw new Error('Missing NEXT_PUBLIC_ORDERS_GRPC_ENDPOINT')

  const ordersGrpc = new OrdersGrpcWebImpl(endpoint, {
    transport: await createTransportWithMetadata(),
    debug: process.env.NODE_ENV !== 'production',
  })

  _ordersClient = new OrdersServiceClientImpl(ordersGrpc)
  return _ordersClient
}
