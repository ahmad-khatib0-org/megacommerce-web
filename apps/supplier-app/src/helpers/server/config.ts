import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { dump, load } from 'js-yaml'

import { Config } from '@megacommerce/proto/common/v1/config'
import { commonClient } from '@/helpers/server'

const CONFIG_DIR = './config'

export async function initConfig(retries = 3): Promise<Config> {
  const storePath = `${CONFIG_DIR}/config.${process.env.NODE_ENV}.yaml`
  if (existsSync(storePath)) {
    try {
      const config = load(await readFile(storePath, 'utf8')) as Config
      return config
    } catch (err) {
      throw Error(`failed to read the config file: ${err}`)
    }
  } else {
    let lastErr: Error | null = null
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await new Promise((resolve, reject) => {
          commonClient().configGet({}, async (err, res) => {
            const errMsg = 'failed to retrieve config from common service'
            if (err) return reject(new Error(`${errMsg}: ${err.message}`))
            if (res?.error) return reject(new Error(`${errMsg}: ${res.error}`))
            if (!res?.data) return reject(new Error(`${errMsg}: no config data received`))
            resolve(res.data)
            await writeFile(storePath, dump(res.data), 'utf8')
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
}
