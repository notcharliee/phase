import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const selfRoles = {
  id: ModuleId.SelfRoles,
  name: "Self Roles",
  description: "Enables members to self-assign roles through message methods.",
  tags: ["Utility", "Beta"],
} as const satisfies ModuleDefinition
