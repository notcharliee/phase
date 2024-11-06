import { relations } from "drizzle-orm"
import { pgTable, varchar } from "drizzle-orm/pg-core"

import { modules } from "~/postgres/schemas/modules"
import { themes } from "~/postgres/schemas/themes"

// tables //

export const guilds = pgTable("guilds", {
  id: varchar("id", { length: 19 }).unique().primaryKey(),
  adminIds: varchar("admin_ids", { length: 19 }).array().notNull(),
  themeId: varchar("theme_id", { length: 19 }),
})

// relations //

export const guildsRelations = relations(guilds, ({ one }) => ({
  modules: one(modules, {
    fields: [guilds.id],
    references: [modules.guildId],
  }),
  theme: one(themes, {
    fields: [guilds.themeId],
    references: [themes.id],
  }),
}))
