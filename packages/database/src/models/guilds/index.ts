import { Schema } from "mongoose"

import { commandSchema } from "~/models/guilds/commands"
import { modulesSchema } from "~/models/guilds/modules"
import { defineModel } from "~/utils"

import type { GuildCommand } from "~/models/guilds/commands"
import type { GuildModules } from "~/models/guilds/modules"

export interface Guild {
  id: string
  admins: string[]
  commands?: Map<string, GuildCommand>
  modules?: Partial<GuildModules>
}

export type { GuildCommand, GuildModules }

const guildsSchema = new Schema<Guild>({
  id: { type: Schema.Types.String, required: true },
  admins: { type: [Schema.Types.String], required: true, default: [] },
  commands: { type: Schema.Types.Map, of: commandSchema },
  modules: { type: modulesSchema },
})

export const guilds = defineModel("Guilds", guildsSchema, {
  id: { unique: true },
})
