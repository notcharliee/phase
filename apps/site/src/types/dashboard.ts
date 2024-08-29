import type {
  APIGuild,
  APIGuildChannel,
  APIMessage,
  GuildChannelType,
} from "@discordjs/core/http-only"
import type { GuildCommand, GuildModules } from "~/lib/db"
import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export type ModulesFormValues = z.infer<typeof modulesSchema>

export type ModulesFormValuesWithData = Partial<{
  [K in keyof ModulesFormValues]: ModulesFormValues[K] & {
    _data: GuildModulesData<K>
  }
}>

export type GuildModulesData<T extends keyof GuildModules> = T extends "Forms"
  ? {
      messages: APIMessage[]
    }
  : T extends "Levels"
    ? {
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
    : T extends "Tickets"
      ? {
          message: APIMessage | undefined
        }
      : T extends "TwitchNotifications"
        ? {
            streamerNames: string[]
          }
        : Record<string, unknown>

export type GuildModulesWithData = Partial<{
  [K in keyof GuildModules]: GuildModules[K] & {
    _data: GuildModulesData<K>
  }
}>

export type DashboardData = {
  _id: string
  guild: APIGuild & {
    channels: APIGuildChannel<GuildChannelType>[]
    admins: string[]
    commands: Record<string, GuildCommand> | undefined
    modules: GuildModulesWithData | undefined
  }
}
