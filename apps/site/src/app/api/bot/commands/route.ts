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
  const commands = await discordAPI.applicationCommands.getGlobalCommands(
    env.DISCORD_ID,
  )

  const response = commands.flatMap((command) => {
    if (
      command.options &&
      command.options.every(
        (option) => option.type === ApplicationCommandOptionType.Subcommand,
      )
    ) {
      return (command.options as APIApplicationCommandSubcommandOption[]).map(
        (subcommand) => ({
          name: `${command.name} ${subcommand.name}`,
          description: subcommand.description,
          default_member_permissions: command.default_member_permissions,
          dm_permission: command.dm_permission,
          options: subcommand.options,
          nsfw: command.nsfw,
        }),
      )
    }

    return {
      name: command.name,
      description: command.description,
      default_member_permissions: command.default_member_permissions,
      dm_permission: command.dm_permission,
      options: command.options,
      nsfw: command.nsfw,
    }
  })

  return NextResponse.json(response)
}

export type GetBotCommandsResponse = ExtractAPIType<typeof GET>
