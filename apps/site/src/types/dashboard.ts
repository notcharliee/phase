import type {
  APIGuild,
  APIGuildChannel,
  APIMessage,
  GuildChannelType,
} from "@discordjs/core/http-only"
import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { GuildCommand, GuildModules } from "~/types/db"
import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export interface ModulesDataFields {
  [ModuleId.Forms]: {
    messages: APIMessage[]
  }
  [ModuleId.Levels]: {
    leaderboard: {
      id: string
      username: string
      global_name: string
      avatar: string
      level: number
      xp: number
      rank: number
      target: number
    }[]
  }
  [ModuleId.Tickets]: {
    message: APIMessage | undefined
  }
  [ModuleId.TwitchNotifications]: {
    streamerNames: string[]
  }
}

export type ModulesFormValues = z.infer<typeof modulesSchema>

export type ModulesFormValuesWithData = Partial<{
  [K in keyof ModulesFormValues]: ModulesFormValues[K] & {
    _data: K extends keyof ModulesDataFields ? ModulesDataFields[K] : unknown
  }
}>

export type GuildModulesWithData = Partial<{
  [K in keyof GuildModules]: GuildModules[K] & {
    _data: K extends keyof ModulesDataFields ? ModulesDataFields[K] : unknown
  }
}>

export interface DashboardData {
  guild: APIGuild & {
    channels: APIGuildChannel<GuildChannelType>[]
    admins: string[]
    commands: Record<string, GuildCommand> | undefined
    modules: GuildModulesWithData | undefined
  }
}
