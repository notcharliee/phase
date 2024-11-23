import { pgTable, varchar } from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

export const afks = pgTable("afks", {
  userId: snowflake().unique().primaryKey(),
  reason: varchar({ length: 256 }),
})
