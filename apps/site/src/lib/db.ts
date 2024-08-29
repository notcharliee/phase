import { Database, mongoose } from "@repo/database"

const database = new Database({
  autoIndex: false,
  cacheConnection: true,
  debug: false,
})

export { database, mongoose }
export type * from "@repo/database"
