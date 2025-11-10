import 'client-only'
import { Any } from '@megacommerce/proto/shared/v1/types'

import { MAX_INT32, MIN_INT32 } from '../constants'
import { tr } from './translation'

export const handleGrpcWebErr = (err: unknown, lang: string): string => {
  // Check for specific error properties
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as any).code

    // Map gRPC error codes to translation keys
    switch (code) {
      case 1: // CANCELLED
        return tr(lang, 'error.canceled')
      case 2: // UNKNOWN
        return tr(lang, 'error.unknown')
      case 3: // INVALID_ARGUMENT
        return tr(lang, 'error.invalid_argument')
      case 4: // DEADLINE_EXCEEDED
        return tr(lang, 'error.deadline_exceeded')
      case 5: // NOT_FOUND
        return tr(lang, 'error.not_found')
      case 6: // ALREADY_EXISTS
        return tr(lang, 'error.already_exists')
      case 7: // PERMISSION_DENIED
        return tr(lang, 'error.permission_denied')
      case 8: // RESOURCE_EXHAUSTED
        return tr(lang, 'error.resource_exhausted')
      case 9: // FAILED_PRECONDITION
        return tr(lang, 'error.failed_precondition')
      case 10: // ABORTED
        return tr(lang, 'error.aborted')
      case 11: // OUT_OF_RANGE
        return tr(lang, 'error.out_of_range')
      case 12: // UNIMPLEMENTED
        return tr(lang, 'error.unimplemented')
      case 13: // INTERNAL
        return tr(lang, 'error.internal')
      case 14: // UNAVAILABLE
        return tr(lang, 'error.unavailable')
      case 15: // DATA_LOSS
        return tr(lang, 'error.data_loss')
      case 16: // UNAUTHENTICATED
        return tr(lang, 'error.unauthenticated')
      default:
        // Fallback to message if available
        if ('message' in err && typeof (err as any).message === 'string') {
          const message = (err as any).message
          if (message.trim().length > 0 && !message.toLowerCase().includes('response closed')) {
            return message
          }
        }
    }
  }

  // Fallback for non-gRPC errors or missing code
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as any).message
    if (typeof message === 'string' && message.trim().length > 0) {
      if (message.toLowerCase().includes('response closed')) {
        return tr(lang, 'error.internal')
      }
      return message
    }
  }

  return tr(lang, 'error.internal')
}

export function toAnyGrpc(value: any): Any {
  if (typeof value === 'string') {
    return {
      typeUrl: 'type.googleapis.com/google.protobuf.StringValue',
      value: new TextEncoder().encode(value), // Just the raw string bytes
    }
  } else if (typeof value === 'boolean') {
    return {
      typeUrl: 'type.googleapis.com/google.protobuf.BoolValue',
      value: new Uint8Array([value ? 1 : 0]), // Single byte: 1 for true, 0 for false
    }
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value >= MIN_INT32 && value <= MAX_INT32) {
        // Use Int32Value for 32-bit range
        const buffer = new ArrayBuffer(4)
        new DataView(buffer).setInt32(0, value, true)
        return {
          typeUrl: 'type.googleapis.com/google.protobuf.Int32Value',
          value: new Uint8Array(buffer),
        }
      } else {
        // Use Int64Value for larger integers
        const buffer = new ArrayBuffer(8)
        new DataView(buffer).setBigInt64(0, BigInt(value), true)
        return {
          typeUrl: 'type.googleapis.com/google.protobuf.Int64Value',
          value: new Uint8Array(buffer),
        }
      }
    } else {
      // Use DoubleValue for decimals
      const buffer = new ArrayBuffer(8)
      new DataView(buffer).setFloat64(0, value, true)
      return {
        typeUrl: 'type.googleapis.com/google.protobuf.DoubleValue',
        value: new Uint8Array(buffer),
      }
    }
  }
  return { value: new Uint8Array(), typeUrl: '' }
}
