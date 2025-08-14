import 'server-only'

import { commonClient } from '@/helpers/server/grpc'
import { isBuildStage, Trans } from '@megacommerce/shared/server'

export class System {
  private static _instatance: System
  private _initialized = false

  static instance(): System {
    if (!this._instatance) this._instatance = new System()
    return this._instatance
  }

  /**
   * @method init the required config, trans, ... In order to start the server
   * 
     TODO: relay on cached config, trans, ... For better CI builds
   */
  async init(): Promise<void> {
    // const isBuildOrProd = isBuildStage() || process.env.NODE_ENV === 'production'
    if (this._initialized) return
    try {
      // await Trans.init(commonClient, !isBuildOrProd) // cached trans in build/prod
      await Trans.init(commonClient) // cached trans in build/prod
      this._initialized = true
    } catch (err) {
      console.error(err)
      throw Error('failed to load a webpage, please try to refresh the browser tab')
    }
  }
}
