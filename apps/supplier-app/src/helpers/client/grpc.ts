import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'
import { GrpcWebError, GrpcWebImpl, UsersServiceClientImpl } from '@megacommerce/proto/web/users/v1/users'
import { ServerInternalErrorMessage } from '@megacommerce/shared/client'

const usersGrpc = new GrpcWebImpl(process.env['NEXT_PUBLIC_GRPC_ENDPOINT'] as string, {
  transport: grpc.CrossBrowserHttpTransport({ withCredentials: true }),
  debug: process.env.NODE_ENV !== 'production',
})

export const usersClient = new UsersServiceClientImpl(usersGrpc)

export const handleGrpcWebErr = (err: unknown): string => {
  if (err instanceof GrpcWebError) {
    return err.message
  }
  return ServerInternalErrorMessage
}
