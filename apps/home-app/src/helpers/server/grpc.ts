import 'server-only'
import { credentials } from '@grpc/grpc-js'
import { Common } from '@megacommerce/proto/common/v1'

const url = new URL(process.env['COMMON_GRPC_ENDPOINT'] as string)
export const commonClient = new Common.CommonServiceClient(url.host, credentials.createInsecure())
