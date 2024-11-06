import { ModuleId } from "@repo/utils/modules"
import { boolean, varchar } from "drizzle-orm/pg-core"

import { moduleBase, modulePgTable } from "~/postgres/schemas/modules/_utils"

// tables //

export const welcomeMessageModules = modulePgTable(ModuleId.WelcomeMessages, {
  ...moduleBase,
  channelId: varchar("channel_id", { length: 19 }).notNull(),
  content: varchar("content", { length: 2000 }).notNull(),
  mention: boolean("mention").default(false).notNull(),
  card: boolean("card").default(false).notNull(),
})
