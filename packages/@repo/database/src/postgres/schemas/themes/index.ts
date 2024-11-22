import { relations } from "drizzle-orm"
import {
  boolean,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export interface ThemeVariables {
  // colours
  primaryColour?: number
  secondaryColour?: number
  accentColour?: number
  backgroundColour?: number
  // background image
  backgroundImageURL?: string
  backgroundImageHash?: string
}

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 1024 }),
  keywords: varchar("keywords", { length: 32 }).array().default([]),
  authorId: varchar("author_id", { length: 19 }).notNull(),
  guildId: varchar("guild_id", { length: 19 }),
  public: boolean("public").default(false).notNull(),
  pending: boolean("pending").default(false).notNull(),
  variables: jsonb("variables").$type<ThemeVariables>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  extendsId: uuid("extends_id"),
})

export const themeRelations = relations(themes, ({ one }) => ({
  extends: one(themes, {
    fields: [themes.extendsId],
    references: [themes.id],
  }),
}))
