import type { GuildModules } from "@repo/schemas"

import type { GuildData, UserData } from "../../_cache/user"

export type ModuleFormProps<
  TName extends keyof GuildModules,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TData extends Record<string, unknown> = {},
> = {
  defaultValues: GuildModules[TName] | undefined
  data: {
    user: UserData
    guild: GuildData
  } & TData
}
