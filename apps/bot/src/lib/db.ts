import { Database, mongoose } from "@repo/database"

import { env } from "~/lib/env"

const db = await new Database({
  debug: env.NODE_ENV !== "production",
  cacheConnection: true,
}).init()

export { db, mongoose }
export type * from "@repo/database"
