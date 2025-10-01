import 'server-only'
import { Pool } from 'pg';
import { Trans, waitForServiceToBeReady } from '@megacommerce/shared/server'
import { Config } from '@megacommerce/proto/common/v1/config'

import { commonClient, System, AppData } from "@/helpers/server"

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
      console.log(`called the init function`);

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
      console.log(err);
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

async function initDB(cfg: Config): Promise<Pool> {
  try {
    const pool = new Pool({
      application_name: cfg.main?.siteName,
      connectionString: cfg.sql?.dataSource,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: cfg.sql?.connMaxIdleTimeMilliseconds,
      max: cfg.sql?.maxOpenConns,
    })

    try {
      await pool.query('SELECT 1');
      console.log('DB connected successfully');
    } catch (err) {
      throw Error(`DB connection test failed: ${err}`);
    }

    return pool
  } catch (err) {
    throw Error(`failed to init databse connection ${err}`)
  }
}
