import type { ConfigStore } from "~/structures/stores/ConfigStore"
import type { GuildStore } from "~/structures/stores/GuildStore"
import type { InviteStore } from "~/structures/stores/InviteStore"
import type { TwitchStatusStore } from "~/structures/stores/TwitchStatusStore"

import type {} from "@phasejs/core/managers"

declare module "@phasejs/core/managers" {
  interface StoreManager {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    twitchStatuses: TwitchStatusStore
  }
}
