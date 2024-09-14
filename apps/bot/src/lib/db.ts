import { Database } from "@repo/database"

export { mongoose } from "@repo/database"

export const db = new Database({
  autoIndex: true,
  debug: false,
})

export type * from "@repo/database"
