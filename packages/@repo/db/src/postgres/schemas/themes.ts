import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { snowflake } from "~/postgres/custom"

export const themes = pgTable("themes", {
  id: uuid().primaryKey(),
  name: varchar({ length: 128 }).notNull(),
  description: varchar({ length: 1024 }),
  keywords: varchar({ length: 32 }).array(),
  creatorId: snowflake().notNull(),

  // public themes require verification before they can be used
  public: boolean().default(false).notNull(),
  pending: boolean().default(false).notNull(),

  primaryColour: integer().notNull(),
  secondaryColour: integer().notNull(),
  accentColour: integer().notNull(),
  backgroundColour: integer().notNull(),

  // since we use urls, we need to know if the image changes
  // we store a hash at time of creation and compare it to the hash of the image
  // if the hash changes, we know the image has changed and needs reverification
  backgroundImageURL: varchar({ length: 256 }),
  backgroundImageHash: varchar({ length: 64 }),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
