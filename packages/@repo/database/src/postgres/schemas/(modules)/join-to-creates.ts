import { relations } from "drizzle-orm"
import { boolean, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

// tables //

export const joinToCreates = pgTable("join_to_creates", {
  guildId: snowflake().unique().primaryKey(),
  enabled: boolean().notNull(),
  channelId: snowflake().notNull(),
  categoryId: snowflake().notNull(),
})

export const joinToCreateChannels = pgTable(
  "join_to_create_channels",
  {
    guildId: snowflake(),
    channelId: snowflake(),
    ownerId: snowflake(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.guildId, table.channelId] }),
  }),
)

// relations //

export const joinToCreatesRelations = relations(joinToCreates, ({ many }) => ({
  activeChannels: many(joinToCreateChannels),
}))

export const joinToCreateChannelsRelations = relations(
  joinToCreateChannels,
  ({ one }) => ({
    joinToCreates: one(joinToCreates, {
      fields: [joinToCreateChannels.guildId],
      references: [joinToCreates.guildId],
    }),
  }),
)
