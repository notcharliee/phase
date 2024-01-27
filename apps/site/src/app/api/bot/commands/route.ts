import { NextResponse } from "next/server"
import { AppConfigDynamic } from "next/dist/build/utils"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import {
  ApplicationCommandOptionType,
  type APIApplicationCommandSubcommandOption,
} from "discord-api-types/v10"

import { env } from "@/lib/env"
import type { ExtractAPIType } from "@/types/api"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const dynamic: AppConfigDynamic = "force-dynamic"


export const GET = async () => {
  const commands = await discordAPI.applicationCommands.getGlobalCommands(env.DISCORD_ID)

  const response = commands.flatMap(command => {
    if (command.name !== command.description) return {
      name: command.name,
      description: command.description,
      default_member_permissions: command.default_member_permissions,
      dm_permission: command.dm_permission,
      options: command.options?.filter((option) => option.type !== ApplicationCommandOptionType.Subcommand),
      nsfw: command.nsfw,
    }

    if (command.options) return command.options
      .filter(option => option.type === ApplicationCommandOptionType.Subcommand)
      .map((subcommand) => ({
        name: `${command.name} ${subcommand.name}`,
        description: subcommand.description,
        default_member_permissions: command.default_member_permissions,
        dm_permission: command.dm_permission,
        options: (subcommand as APIApplicationCommandSubcommandOption).options,
        nsfw: command.nsfw,
      }))

    return []
  })

  return NextResponse.json(response)
}


export type GetBotCommandsResponse = ExtractAPIType<typeof GET>
