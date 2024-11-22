import { ModuleId } from "@repo/utils/modules"
import { varchar } from "drizzle-orm/pg-core"

import { moduleBase, modulePgTable } from "~/postgres/schemas/modules/_utils"

// tables //

export const joinToCreateModules = modulePgTable(ModuleId.JoinToCreates, {
  ...moduleBase,
  channelId: varchar("channel_id", { length: 19 }).notNull(),
  categoryId: varchar("category_id", { length: 19 }).notNull(),
})
