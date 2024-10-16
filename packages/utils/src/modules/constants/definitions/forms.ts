import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const forms = {
  id: ModuleId.Forms,
  name: "Forms",
  description: "Creates forms in your server for your members to fill out.",
  tags: ["Utility"],
} as const satisfies ModuleDefinition
