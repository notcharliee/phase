import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const autoRoles = {
  id: ModuleId.AutoRoles,
  name: "Auto Roles",
  description: "Automatically assigns roles to new members of your server.",
  tags: ["Utility"],
} as const satisfies ModuleDefinition
