import type { ConfigStore } from "~/structures/stores/ConfigStore"
import type { GuildStore } from "~/structures/stores/GuildStore"
import type { InviteStore } from "~/structures/stores/InviteStore"
import type { StreamerStore } from "~/structures/stores/StreamerStore"

import type {} from "@phasejs/core"

declare module "@phasejs/core" {
  interface BotStores {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    streamers: StreamerStore
  }
}
