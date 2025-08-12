import 'server-only'
import { credentials } from '@grpc/grpc-js'
import { Common } from '@megacommerce/proto/common/v1'

export const commonClient = new Common.CommonServiceClient('localhost:8080', credentials.createInsecure())
