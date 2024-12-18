import type { client } from "@repo/trpc/client"
import type { ModuleId } from "@repo/utils/modules"
import type { GuildModules } from "~/types/db"
import type { modulesSchema } from "~/validators/modules"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"

export interface GuildModulesDataFields {
  [ModuleId.TwitchNotifications]: {
    streamerNames: Record<number, string>
  }
}

export type ModulesFormValuesInput = z.input<typeof modulesSchema>
export type ModulesFormValuesOutput = z.output<typeof modulesSchema>

export type ModulesFormReturn = UseFormReturn<ModulesFormValuesInput>

export type ModulesFormValuesInputWithData = Partial<{
  [K in keyof ModulesFormValuesInput]: ModulesFormValuesInput[K] & {
    _data: K extends keyof GuildModulesDataFields
      ? GuildModulesDataFields[K]
      : unknown
  }
}>

export type GuildModulesWithData = Partial<{
  [K in keyof GuildModules]: GuildModules[K] & {
    _data: K extends keyof GuildModulesDataFields
      ? GuildModulesDataFields[K]
      : unknown
  }
}>

type DashboardGuildData = Exclude<
  Awaited<ReturnType<typeof client.guilds.getById.query>>,
  null
>

export interface DashboardData {
  guild: DashboardGuildData
}
