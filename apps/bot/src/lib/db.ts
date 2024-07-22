import { Database, mongoose } from "@repo/database"

import { env } from "~/lib/env"

const db = await new Database({
  cacheConnection: env.NODE_ENV !== "production",
  debug: false,
}).init()

export { db, mongoose }
export type * from "@repo/database"
