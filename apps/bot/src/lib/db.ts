import { Database, mongoose } from "@repo/database"

import { env } from "~/lib/env"

const db = await new Database({
  autoIndex: true,
  debug: false,
}).connect(env.MONGODB_URI)

export { db, mongoose }
export type * from "@repo/database"
