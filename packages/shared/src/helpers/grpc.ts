import { Any } from '@megacommerce/proto/shared/v1/types'

export function fromAnyGrpc(anyValue: Any): any {
  if (!anyValue.typeUrl || !anyValue.value) {
    return null
  }

  const decoder = new TextDecoder()

  switch (anyValue.typeUrl) {
    case 'type.googleapis.com/google.protobuf.StringValue':
      return decoder.decode(anyValue.value)

    case 'type.googleapis.com/google.protobuf.BoolValue':
      return anyValue.value[0] === 1

    case 'type.googleapis.com/google.protobuf.Int32Value':
      return new DataView(anyValue.value.buffer).getInt32(0, true)

    case 'type.googleapis.com/google.protobuf.Int64Value': {
      const bigIntValue = new DataView(anyValue.value.buffer).getBigInt64(0, true)
      // Convert to Number if safe, otherwise keep as BigInt
      const numValue = Number(bigIntValue)
      return numValue <= Number.MAX_SAFE_INTEGER ? numValue : bigIntValue
    }

    case 'type.googleapis.com/google.protobuf.DoubleValue':
      return new DataView(anyValue.value.buffer).getFloat64(0, true)

    default:
      console.warn(`Unsupported type URL: ${anyValue.typeUrl}`)
      return null
  }
}
