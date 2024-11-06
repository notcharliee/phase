import { ModuleId } from "@repo/utils/modules"
import { boolean, pgTableCreator, varchar } from "drizzle-orm/pg-core"

export const moduleBase = {
  guildId: varchar("guild_id", { length: 19 }).unique().primaryKey(),
  enabled: boolean("enabled").notNull(),
}

export const modulePgTable = pgTableCreator((id) => {
  if (!Object.values(ModuleId).includes(id as ModuleId))
    throw new Error("Invalid module ID: " + id)
  return `modules_${id}`
})
