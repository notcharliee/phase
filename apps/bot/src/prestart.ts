import "~/lib/env"
import "~/lib/db"

import type { Client } from "discord.js"

export default async function prestart(client: Client<false>) {
  await client.store.init()
}
