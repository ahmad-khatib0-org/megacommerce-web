import { Trans } from '@megacommerce/shared/server'

import { commonClient } from './grpc'
import { initConfig } from './config'
import { initDB } from './db'
import { System } from './system'

let _initPromise: Promise<System> | null = null
let _initialized = false
let _system: System

/**
 * Get the initialized system (config, db)
 * Ensures all dependencies are initialized exactly once
 */
export const system = async (): Promise<Readonly<System>> => {
  const sys = await init()
  return sys
}

/**
 * Initialize the required config and database for server startup
 */
async function init(): Promise<System> {
  if (_initialized) return _system
  if (_initPromise) return _initPromise

  _initPromise = (async () => {
    try {
      const client = commonClient()
      await new Promise<void>((resolve, reject) => {
        client.ping({}, (err: Error | null) => {
          if (err) reject(new Error('Common service is unavailable'))
          else resolve()
        })
      })

      const config = await initConfig()
      const db = await initDB(config)
      await Trans.init(client, false)

      _system = { config, db }
      _initialized = true
      return _system
    } catch (err) {
      console.error(err)
      _initPromise = null
      throw Error(`Failed to initialize system: ${err}`)
    }
  })()

  return _initPromise
}
