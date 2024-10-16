import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const warnings = {
  id: ModuleId.Warnings,
  name: "Warnings",
  description: "Helps moderators add, remove, and track member warnings.",
  tags: ["Moderation"],
} as const satisfies ModuleDefinition
