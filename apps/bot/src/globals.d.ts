import { Client as DiscordClient } from "discord.js"

import { Music } from "@repo/music"

import { Store } from "~/lib/store"

declare module "discord.js" {
  interface Client extends DiscordClient {
    music: Music
    store: Store
  }
}
