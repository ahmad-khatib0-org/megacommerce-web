import 'client-only'
import { grpc } from '@improbable-eng/grpc-web'

export class GrpcWebError extends Error {
  code: grpc.Code
  metadata: grpc.Metadata
  constructor(message: string, code: grpc.Code, metadata: grpc.Metadata) {
    super(message)
    this.name = 'GrpcWebError'
    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.metadata = metadata
  }
}

/**
 * ClientInformation represents essential information about a user, like 
 * 
 * language, currency, ship to location, ...
*/
export interface ClientInformation {
  country: string
  language: string
  currency: string
}
