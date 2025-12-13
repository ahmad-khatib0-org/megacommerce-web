import { Config } from '@megacommerce/proto/common/v1/config'
import { system } from '../helpers'

export const configProvider = {
  provide: 'APP_CONFIG',
  useFactory: async (): Promise<Config> => {
    const sys = await system()
    return sys.config
  },
}
