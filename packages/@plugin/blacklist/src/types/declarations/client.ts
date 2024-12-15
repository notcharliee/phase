import type { Blacklist } from "~/structures/Blacklist"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    blacklist: Blacklist
  }
}
