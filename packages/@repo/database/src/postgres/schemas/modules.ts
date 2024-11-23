import { relations } from "drizzle-orm"
import { pgTable } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"
import {
  joinToCreates,
  levels,
  welcomeMessages,
} from "~/postgres/schemas/(modules)"

export const modules = pgTable("modules", {
  guildId: snowflake().unique().primaryKey(),
})

export const modulesRelations = relations(modules, ({ one }) => ({
  joinToCreates: one(joinToCreates, {
    fields: [modules.guildId],
    references: [joinToCreates.guildId],
  }),
  levels: one(levels, {
    fields: [modules.guildId],
    references: [levels.guildId],
  }),
  welcomeMessages: one(welcomeMessages, {
    fields: [modules.guildId],
    references: [welcomeMessages.guildId],
  }),
}))

export * from "~/postgres/schemas/(modules)"
