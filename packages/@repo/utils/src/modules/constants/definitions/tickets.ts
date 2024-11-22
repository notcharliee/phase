import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const tickets = {
  id: ModuleId.Tickets,
  name: "Tickets",
  description: "Enables the creation of private ticket-style channels.",
  tags: ["Utility"],
} as const satisfies ModuleDefinition
