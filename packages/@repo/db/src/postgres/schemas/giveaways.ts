import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

export const giveaways = pgTable("giveaways", {
  id: uuid().unique().primaryKey(),
  prize: varchar({ length: 512 }).notNull(),
  hostId: snowflake().notNull(),
  guildId: snowflake().notNull(),
  channelId: snowflake().notNull(),
  messageId: snowflake().notNull(),
  maxWinners: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  endsAt: timestamp().notNull(),
})
