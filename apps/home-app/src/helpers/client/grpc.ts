import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'
import { GrpcWebImpl, UsersServiceClientImpl } from '@megacommerce/proto/web/users/v1/users'

const usersGrpc = new GrpcWebImpl(process.env['NEXT_PUBLIC_USERS_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const usersClient = new UsersServiceClientImpl(usersGrpc)
