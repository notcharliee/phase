import { boolean, pgTable, varchar } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

export const welcomeMessages = pgTable("welcome_messages", {
  guildId: snowflake().unique().primaryKey(),
  enabled: boolean().notNull(),
  channelId: snowflake().notNull(),
  content: varchar({ length: 2000 }).notNull(),
  mention: boolean().default(false).notNull(),
  card: boolean().default(false).notNull(),
})
