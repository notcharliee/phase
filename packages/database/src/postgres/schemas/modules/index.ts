import { ModuleId } from "@repo/utils/modules"
import { relations } from "drizzle-orm"
import { pgTable, varchar } from "drizzle-orm/pg-core"

import { guilds } from "~/postgres/schemas/guilds"
import { joinToCreateModules } from "~/postgres/schemas/modules/join-to-creates"
import { welcomeMessageModules } from "~/postgres/schemas/modules/welcome-messages"

// tables //

export const modules = pgTable("modules", {
  guildId: varchar("guild_id", { length: 19 }).unique().primaryKey(),
})

export * from "~/postgres/schemas/modules/join-to-creates"
export * from "~/postgres/schemas/modules/welcome-messages"

// relations //

export const modulesRelations = relations(modules, ({ one }) => ({
  guild: one(guilds, {
    fields: [modules.guildId],
    references: [guilds.id],
  }),
  [ModuleId.JoinToCreates]: one(joinToCreateModules, {
    fields: [modules.guildId],
    references: [joinToCreateModules.guildId],
  }),
  [ModuleId.WelcomeMessages]: one(welcomeMessageModules, {
    fields: [modules.guildId],
    references: [welcomeMessageModules.guildId],
  }),
}))
