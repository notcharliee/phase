import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const joinToCreates = {
  id: ModuleId.JoinToCreates,
  name: "Join to Creates",
  description: "Enables the creation of temporary voice channels.",
  tags: ["Utility"],
} as const satisfies ModuleDefinition
