import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const reactionRoles = {
  id: ModuleId.ReactionRoles,
  name: "Reaction Roles",
  description: "Enables members to self-assign roles via reactions.",
  tags: ["Utility"],
} as const satisfies ModuleDefinition
