import { Database, mongoose } from "@repo/db"

const db = new Database({
  autoIndex: true,
  debug: false,
})

export { db, mongoose }
export type * from "@repo/db"
