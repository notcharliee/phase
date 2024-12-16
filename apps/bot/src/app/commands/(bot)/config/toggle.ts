import { BotSubcommandBuilder } from "@phasejs/builders"

import { ModuleDefinitions } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import type { ModuleId } from "@repo/utils/modules"

export default new BotSubcommandBuilder()
  .setName("toggle")
  .setDescription("Toggles a module's enabled state.")
  .addStringOption((option) =>
    option
      .setName("module")
      .setDescription("The module to toggle.")
      .setRequired(true)
      .addChoices(
        Object.values(ModuleDefinitions).map(({ id: value, name }) => ({
          name,
          value,
        })),
      ),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const moduleId = interaction.options.getString("module", true)

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)!
    const guildAdminIds = guildDoc.admins ?? []

    if (!guildAdminIds.includes(interaction.user.id)) {
      return await interaction.editReply(
        BotErrorMessage.userNotAdmin("command").toJSON(),
      )
    }

    const moduleConfig = guildDoc.modules?.[moduleId as ModuleId]

    if (!moduleConfig) {
      return await interaction.editReply(
        BotErrorMessage.moduleNotConfigured(moduleId as ModuleId).toJSON(),
      )
    }

    const moduleName = ModuleDefinitions[moduleId as ModuleId].name

    try {
      await db.guilds.updateOne(
        { id: interaction.guildId! },
        { $set: { [`modules.${moduleId}.enabled`]: !moduleConfig.enabled } },
      )
    } catch (error) {
      console.error(
        `Failed to toggle module ${moduleId} (${moduleName}) in guild ${guildDoc.id}:`,
      )
      console.error(error)

      return await interaction.editReply(
        BotErrorMessage.unknown({
          error: error as Error,
          commandName: "config toggle",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }

    return await interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Module Toggled")
          .setDescription(
            `The \`${moduleName}\` module is now ${!moduleConfig.enabled ? "enabled" : "disabled"}.`,
          )
      }),
    )
  })
