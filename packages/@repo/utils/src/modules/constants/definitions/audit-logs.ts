import { ModuleId } from "~/modules/constants/ids"

import type { ModuleDefinition } from "~/modules/types/definitions"

export const auditLogs = {
  id: ModuleId.AuditLogs,
  name: "Audit Logs",
  description: "Sends detailed audit log entries to the channels you specify.",
  tags: ["Moderation"],
} as const satisfies ModuleDefinition
