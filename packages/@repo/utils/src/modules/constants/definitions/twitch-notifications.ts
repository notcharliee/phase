import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const twitchNotifications = {
  id: ModuleId.TwitchNotifications,
  name: "Twitch Notifications",
  description: "Notifies your server when a Twitch streamer goes live.",
  tags: ["Notifications"],
} as const satisfies ModuleDefinition
