import type { APIApplicationCommandOption } from "discord-api-types/v10"

export type Command = {
  name: string
  description: string
  default_member_permissions: string | null
  dm_permission: boolean | undefined
  options: APIApplicationCommandOption[] | undefined
  nsfw: boolean | undefined
}
