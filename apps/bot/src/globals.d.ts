import { Client as DiscordClient } from "discord.js"

import { DisTube } from "distube"

declare module "discord.js" {
  interface Client extends DiscordClient {
    distube: DisTube
  }
}
