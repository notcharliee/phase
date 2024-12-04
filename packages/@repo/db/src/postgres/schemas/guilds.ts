import { relations } from "drizzle-orm"
import { pgTable } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"
import { modules } from "~/postgres/schemas/modules"
import { themes } from "~/postgres/schemas/themes"

// tables //

export const guilds = pgTable("guilds", {
  id: snowflake().unique().primaryKey(),
  adminIds: snowflake().array().notNull(),
  themeId: snowflake(),
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
