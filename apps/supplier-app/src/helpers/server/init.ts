import 'server-only'

import { Trans, waitForServiceToBeReady } from '@megacommerce/shared/server'
import { AppData, commonClient, initConfig, initDB, System } from "@/helpers/server"

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
      const { port, hostname } = new URL(process.env['COMMON_GRPC_ENDPOINT'] as string)
      await waitForServiceToBeReady(hostname, parseInt(port))
      await Trans.init(commonClient);
      const config = await initConfig();
      const db = await initDB(config);
      await AppData.instance().init(db)

      _system = { config, db };
      _initialized = true;
      return _system;
    } catch (err) {
      console.error(err);
      _initPromise = null;
      throw Error("An Error occurred while initing server data & config")
    }
  })();

  return _initPromise;
}

