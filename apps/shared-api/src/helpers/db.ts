import { Pool } from 'pg'

import { Config } from '@megacommerce/proto/common/v1/config'

export async function initDB(cfg: Config): Promise<Pool> {
  try {
    const pool = new Pool({
      application_name: cfg.main?.siteName,
      connectionString: cfg.sql?.dataSource,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: cfg.sql?.connMaxIdleTimeMilliseconds,
      max: cfg.sql?.maxOpenConns,
    })

    try {
      await pool.query('SELECT 1')
      console.log('DB connected successfully')
    } catch (err) {
      throw Error(`DB connection test failed: ${err}`)
    }

    return pool
  } catch (err) {
    throw Error(`failed to init database connection: ${err}`)
  }
}
