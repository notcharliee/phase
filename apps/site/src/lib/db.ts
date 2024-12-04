import { Database } from "@repo/db"

import { env } from "~/lib/env"

export const db = new Database({
  autoIndex: false,
  debug: false,
})

export async function connectDB() {
  await db.connect(env.MONGODB_URI)
  return db
}

export { mongoose } from "@repo/db"
