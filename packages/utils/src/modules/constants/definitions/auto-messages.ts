import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const autoMessages = {
  id: ModuleId.AutoMessages,
  name: "Auto Messages",
  description: "Automatically sends messages on a set interval.",
  tags: ["Utility", "Engagement"],
} as const satisfies ModuleDefinition
