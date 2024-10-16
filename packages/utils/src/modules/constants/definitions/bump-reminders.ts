import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const bumpReminders = {
  id: ModuleId.BumpReminders,
  name: "Bump Reminders",
  description: "Reminds members to bump your server after the cooldown period.",
  tags: ["Utility", "Engagement"],
} as const satisfies ModuleDefinition
