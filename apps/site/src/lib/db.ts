import { Database, mongoose } from "@repo/database"

import { env } from "~/lib/env"

const database = new Database({
  autoIndex: false,
  cacheConnection: env.NODE_ENV !== "production",
  debug: false,
})

export { database, mongoose }
export type * from "@repo/database"
