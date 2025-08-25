import 'client-only'
import { GrpcWebError } from '../models'
import { ServerInternalErrorMessage } from '../constants'

export const handleGrpcWebErr = (err: unknown): string => {
  if (err instanceof GrpcWebError) {
    if (err.message.toLowerCase().includes('response closed')) return ServerInternalErrorMessage
    return err.message
  }
  return ServerInternalErrorMessage
}
