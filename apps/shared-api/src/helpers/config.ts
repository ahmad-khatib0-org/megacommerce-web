import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { dump, load } from 'js-yaml'
import { join } from 'path'

import { Config } from '@megacommerce/proto/common/v1/config'
import { commonClient } from './grpc'

const CONFIG_DIR = join(process.cwd(), 'apps', 'shared-api', 'config')

export async function initConfig(retries = 3): Promise<Config> {
  const storePath = join(CONFIG_DIR, `config.${process.env['NODE_ENV'] || 'development'}.yaml`)

  // Try to load from local file first
  if (existsSync(storePath)) {
    try {
      const config = load(await readFile(storePath, 'utf8')) as Config
      console.log('Config loaded from file:', storePath)
      return config
    } catch (err) {
      console.error(`Failed to read config file: ${err}`)
    }
  }

  let lastErr: Error | null = null
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise<Config>((resolve, reject) => {
        commonClient().configGet({}, async (err, res) => {
          const errMsg = 'failed to retrieve config from common service'
          if (err) return reject(new Error(`${errMsg}: ${err.message}`))
          if (res?.error) return reject(new Error(`${errMsg}: ${res.error}`))
          if (!res?.data) return reject(new Error(`${errMsg}: no config data received`))
          try {
            await writeFile(storePath, dump(res.data), 'utf8')
          } catch (writeErr) {
            console.warn(`Failed to cache config: ${writeErr}`)
          }

          resolve(res.data)
        })
      })
    } catch (err) {
      lastErr = err as Error
      console.warn(`initConfig attempt ${attempt} failed: ${err}`)
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)))
      }
    }
  }

  throw lastErr ?? new Error('initConfig failed')
}
