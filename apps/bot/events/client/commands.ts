import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'

import { commandsArray } from '#client/main'


export default Utils.Functions.clientEvent({
  name: 'interactionCreate',
  async execute(client, interaction) {

    if (interaction.isChatInputCommand()) {

      const clientCommandFiles = commandsArray
      const clientCommand = clientCommandFiles.find((clientCommandFile: Utils.Types.SlashCommand) => { return clientCommandFile.data.name == interaction.commandName })


      if (clientCommand) {

        if (clientCommand.permissions) {

          const baseCommandPermissions = clientCommand.permissions.baseCommand
          const subCommandsPermissions = Object.entries(clientCommand.permissions.subCommands ?? {})

          if (baseCommandPermissions && !interaction.memberPermissions?.has(baseCommandPermissions)) return Utils.Functions.clientError(
            interaction,
            'Access Denied!',
            `${Utils.Enums.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Utils.Functions.getPermissionName(baseCommandPermissions).replace(/([a-z])([A-Z])/g, '$1 $2')}\``
          )

          if (subCommandsPermissions) for (const subCommandPermissions of subCommandsPermissions) {

            if (interaction.options.getSubcommand() == subCommandPermissions[0] && !interaction.memberPermissions?.has(subCommandPermissions[1])) return Utils.Functions.clientError(
              interaction,
              'Access Denied!',
              `${Utils.Enums.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Utils.Functions.getPermissionName(subCommandPermissions[1]).replace(/([a-z])([A-Z])/g, '$1 $2')}\``
            )

          }

        }

        clientCommand.execute(client, interaction).catch((error: any) => {

          Utils.Functions.alertDevs({
            title: `Command Failure: /${clientCommand.data.name}`,
            description: `${error}`,
            type: 'error',
          })
  
          Utils.Functions.clientError(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown
          )
  
        })

      }

    }

  }
})