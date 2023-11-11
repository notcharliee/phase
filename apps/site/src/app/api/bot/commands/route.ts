import { NextResponse, NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import discord_api_types_v10 from "discord-api-types/v10"

export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  const globalCommands = await discordAPI.applicationCommands.getGlobalCommands(
    process.env.DISCORD_ID!,
  )

  const commandArray: {
    name: string
    description: string
    default_member_permissions: string | null
    dm_permission: boolean | undefined
    options: discord_api_types_v10.APIApplicationCommandOption[] | undefined
    nsfw: boolean | undefined
  }[] = []

  for (const globalCommand of globalCommands) {
    if (globalCommand.options)
      for (const globalCommandOption of globalCommand.options) {
        commandArray.push({
          name: globalCommand.name,
          description: globalCommand.description,
          default_member_permissions: globalCommand.default_member_permissions,
          dm_permission: globalCommand.dm_permission,
          options: globalCommand.options.map((option) => {
            if (
              option.type !=
              discord_api_types_v10.ApplicationCommandOptionType.Subcommand
            )
              return option as discord_api_types_v10.APIApplicationCommandOption
          }),
          nsfw: globalCommand.nsfw,
        })

        if (
          globalCommandOption.type ==
          discord_api_types_v10.ApplicationCommandOptionType.Subcommand
        )
          commandArray.push({
            name: `${globalCommand.name} ${globalCommandOption.name}`,
            description: globalCommandOption.description,
            default_member_permissions:
              globalCommand.default_member_permissions,
            dm_permission: globalCommand.dm_permission,
            options: globalCommandOption.options,
            nsfw: globalCommand.nsfw,
          })
      }
  }

  // return NextResponse.json(commandArray)
}
