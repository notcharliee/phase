import type { Music } from "@repo/music"
import type { Store } from "~/structures/Store"
import type { Client as DiscordClient } from "discord.js"

declare module "discord.js" {
  interface Client extends DiscordClient {
    music: Music
    store: Store
  }
}
