import { db } from "~/lib/db"
import { env } from "~/lib/env"

import type { Client } from "discord.js"

export default async function prestart(client: Client<false>) {
  await db.connect(env.MONGODB_URI)
  await client.stores.init()
}
