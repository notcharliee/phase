import { db } from "~/lib/db"
import { env } from "~/lib/env"

export default async function prestart() {
  await db.connect(env.MONGODB_URI)
}
