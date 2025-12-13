import { Pool } from 'pg'
import { Config } from '@megacommerce/proto/common/v1/config'

export interface System {
  config: Config
  db: Pool
}
