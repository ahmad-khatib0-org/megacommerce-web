import 'server-only'
import { Config } from "@megacommerce/proto/common/v1/config";

export interface System {
  config: Config | null;
}
