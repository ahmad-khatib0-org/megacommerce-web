import 'server-only'

import { Trans, isBuildStage } from '@megacommerce/shared/server'
import { Config } from '@megacommerce/proto/common/v1/config'
import { commonClient, System } from "@/helpers/server"

// const isBuildOrProd = isBuildStage() || process.env.NODE_ENV === 'production'
// await Trans.init(commonClient, !isBuildOrProd) // cached trans in build/prod
// 

let _initPromise: Promise<System> | null = null;
let _initialized = false
let _system: System

export const system = async (): Promise<Readonly<System>> => {
  const system = await init()
  return system
}

/**
 * @method init the required config, trans, ... In order to start the server
 * 
 * TODO: relay on cached config, trans, ... For better CI builds
*/
async function init(): Promise<System> {
  if (_initialized) return _system;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      await Trans.init(commonClient);
      const config = await initConfig();
      console.log(`called the init function`);

      _initialized = true;
      _system = { config };
      return _system;
    } catch (err) {
      throw Error("An Error occurred while initing server data & config")
    }
  })();

  return _initPromise;
}

async function initConfig(): Promise<Config> {
  return new Promise((resolve, reject) => {
    // if (isBuildStage()) { }
    commonClient.configGet({}, (err, res) => {
      const errMsg = 'failed to retrieve config from common service'
      if (err) return reject(new Error(`${errMsg}: ${err.message}`))
      if (res?.error) return reject(new Error(`${errMsg}: ${res.error}`))
      if (!res?.data) return reject(new Error(`${errMsg}: no config data received`))
      resolve(res.data)
    })
  })
}

