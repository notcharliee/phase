import {
  type APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v10"

import commands from "./commands.json" assert { type: "json" }

interface CommandsConfig {
  name: string
  description: string
  path: string
}

export const commandsConfig = commands
  .flatMap((command: RESTPostAPIChatInputApplicationCommandsJSONBody) => {
    if (
      command.options?.every(
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
  .map((command) => ({
    name: command.name,
    description: command.description,
    path: "/" + command.name.replaceAll(" ", "-"),
  }))
  .sort((a, b) => a.name.localeCompare(b.name)) satisfies CommandsConfig[]
