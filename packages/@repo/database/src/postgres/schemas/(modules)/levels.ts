import { relations, sql } from "drizzle-orm"
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

// enums //

export const destinationType = pgEnum("destination_type", [
  "CHANNEL",
  "REPLY",
  "DM",
])

// tables //

export const levels = pgTable("levels", {
  guildId: snowflake().unique().primaryKey(),
  enabled: boolean().notNull(),
})

export const levelMessages = pgTable(
  "level_messages",
  {
    id: uuid().unique().primaryKey(),
    guildId: snowflake().notNull(),
    destinationType: destinationType().notNull(),
    destinationId: snowflake(),
    content: varchar({ length: 2000 }).notNull(),
    mention: boolean().default(false).notNull(),
    default: boolean().default(false).notNull(),
  },
  (table) => ({
    checkConstraint: check(
      "destination_id_check",
      sql`${table.destinationId} IS NULL OR ${table.destinationType} = 'CHANNEL'`,
    ),
    uniqueConstraint: uniqueIndex()
      .on(table.guildId)
      .where(sql`${table.default} = true`),
  }),
)

export const levelMilestones = pgTable(
  "level_milestones",
  {
    guildId: snowflake().notNull(),
    levelTarget: integer().notNull(),
    roleRewardIds: snowflake().array(),
    messageId: snowflake(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.guildId, table.levelTarget] }),
  }),
)

export const levelRankings = pgTable(
  "level_rankings",
  {
    guildId: snowflake().notNull(),
    userId: snowflake().notNull(),
    level: integer().notNull(),
    xp: integer().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.guildId, table.userId] }),
    guildLeaderboardIdx: uniqueIndex("guild_leaderboard_idx").on(
      table.guildId,
      table.level.desc(),
      table.xp.desc(),
    ),
  }),
)

// relations //

export const levelsRelations = relations(levels, ({ many }) => ({
  messages: many(levelMessages),
  milestones: many(levelMilestones),
  rankings: many(levelRankings),
}))

export const levelMilestonesRelations = relations(
  levelMilestones,
  ({ one }) => ({
    levels: one(levels, {
      fields: [levelMilestones.guildId],
      references: [levels.guildId],
    }),
    message: one(levelMessages, {
      fields: [levelMilestones.messageId],
      references: [levelMessages.id],
    }),
  }),
)

export const levelMessagesRelations = relations(levelMessages, ({ one }) => ({
  levels: one(levels, {
    fields: [levelMessages.guildId],
    references: [levels.guildId],
  }),
}))

export const levelRankingsRelations = relations(levelRankings, ({ one }) => ({
  levels: one(levels, {
    fields: [levelRankings.guildId],
    references: [levels.guildId],
  }),
}))
