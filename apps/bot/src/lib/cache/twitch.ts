import { PersistentCache } from "@repo/cache"

// stores the streamer id and current stream status
export const twitchStreamStatusesCache = await new PersistentCache({
  filePath: "./.cache/twitch-stream-statuses.bson",
}).init<Record<string, boolean>>()
