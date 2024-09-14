import { Database } from "@repo/database"

import { env } from "~/lib/env"

export const db = new Database({
  autoIndex: false,
  debug: false,
})

export async function connectDB() {
  await db.connect(env.MONGODB_URI)
}

export { mongoose } from "@repo/database"
