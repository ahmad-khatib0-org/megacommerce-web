import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'
import { GrpcWebImpl, UsersServiceClientImpl } from '@megacommerce/proto/web/users/v1/users'
import { GrpcWebImpl as ProductsGrpcWebImpl, ProductsServiceClientImpl } from '@megacommerce/proto/web/products/v1/products'

const usersGrpc = new GrpcWebImpl(process.env['NEXT_PUBLIC_USERS_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const usersClient = new UsersServiceClientImpl(usersGrpc)

const productsGrpc = new ProductsGrpcWebImpl(
  process.env['NEXT_PUBLIC_PRODUCTS_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const productsClient = new ProductsServiceClientImpl(productsGrpc)
