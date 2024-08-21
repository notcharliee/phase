import { configsCache } from "./config"
import { guildsCache } from "./guilds"
import { twitchStreamStatusesCache } from "./twitch"

export const cache = {
  configs: configsCache,
  guilds: guildsCache,
  twitchStreamStatuses: twitchStreamStatusesCache,
}
