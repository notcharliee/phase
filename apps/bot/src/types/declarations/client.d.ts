import type { Music } from "~/structures/music/Music"
import type { ConfigStore } from "~/structures/stores/ConfigStore"
import type { GuildStore } from "~/structures/stores/GuildStore"
import type { InviteStore } from "~/structures/stores/InviteStore"
import type { TwitchStatusStore } from "~/structures/stores/TwitchStatusStore"
import type { VoiceManager } from "~/structures/voice/VoiceManager"
import type { Client as BaseClient } from "discord.js"
import type { StoreManager as BaseStoreManager } from "phasebot/managers"

declare module "discord.js" {
  interface Client extends BaseClient {
    music: Music
    voices: VoiceManager
  }
}

declare module "phasebot/managers" {
  interface StoreManager extends BaseStoreManager {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    twitchStatuses: TwitchStatusStore
  }
}
