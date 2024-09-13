import { Client as DiscordClient } from "discord.js"

import { Music } from "@repo/music"

declare module "discord.js" {
  interface Client extends DiscordClient {
    music: Music
  }
}
