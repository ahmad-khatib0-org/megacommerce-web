import { Any } from '@megacommerce/proto/shared/v1/types'

export function fromAnyGrpc(anyValue: Any): any {
  if (!anyValue.typeUrl || !anyValue.value) {
    return null
  }

  switch (anyValue.typeUrl) {
    case 'type.googleapis.com/google.protobuf.StringValue':
      return new TextDecoder().decode(anyValue.value)

    case 'type.googleapis.com/google.protobuf.BoolValue':
      return anyValue.value[0] === 1

    case 'type.googleapis.com/google.protobuf.Int32Value':
      return new DataView(anyValue.value.buffer, anyValue.value.byteOffset, 4).getInt32(0, true)

    case 'type.googleapis.com/google.protobuf.Int64Value': {
      const bigIntValue = new DataView(anyValue.value.buffer, anyValue.value.byteOffset, 8).getBigInt64(
        0,
        true
      )
      const numValue = Number(bigIntValue)
      return numValue <= Number.MAX_SAFE_INTEGER ? numValue : bigIntValue
    }

    case 'type.googleapis.com/google.protobuf.FloatValue':
      return new DataView(anyValue.value.buffer, anyValue.value.byteOffset, 4).getFloat32(0, true)

    case 'type.googleapis.com/google.protobuf.DoubleValue':
      return new DataView(anyValue.value.buffer, anyValue.value.byteOffset, 8).getFloat64(0, true)

    case 'type.googleapis.com/google.protobuf.BytesValue':
      return anyValue.value

    default:
      console.warn(`Unsupported type URL: ${anyValue.typeUrl}`)
      return null
  }
}
