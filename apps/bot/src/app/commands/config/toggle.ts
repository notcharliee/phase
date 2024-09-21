import { BotSubcommandBuilder } from "phasebot/builders"

import { modules } from "@repo/config/phase/modules.ts"

import { CustomMessageBuilder } from "~/lib/builders/message"
import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

import type { ModuleId } from "@repo/config/phase/modules.ts"

export default new BotSubcommandBuilder()
  .setName("toggle")
  .setDescription("Toggles a module's enabled state.")
  .addStringOption((option) =>
    option
      .setName("module")
      .setDescription("The module to toggle.")
      .setRequired(true)
      .addChoices(
        Object.entries(modules).map(([id, { name }]) => ({ name, value: id })),
      ),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const moduleId = interaction.options.getString("module", true)

    const guildDoc = interaction.client.store.guilds.get(interaction.guildId!)!
    const guildAdminIds = guildDoc.admins ?? []

    if (!guildAdminIds.includes(interaction.user.id)) {
      return await interaction.editReply(
        BotError.userNotAdmin("command").toJSON(),
      )
    }

    const moduleConfig = guildDoc.modules?.[moduleId as ModuleId]

    if (!moduleConfig) {
      return await interaction.editReply(
        BotError.moduleNotConfigured(moduleId as ModuleId).toJSON(),
      )
    }

    const moduleName = modules[moduleId as ModuleId].name

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
        BotError.unknown({
          error: error as Error,
          commandName: "config toggle",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }

    return await interaction.editReply(
      new CustomMessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Module Toggled")
          .setDescription(
            `The \`${moduleName}\` module is now ${!moduleConfig.enabled ? "enabled" : "disabled"}.`,
          )
      }),
    )
  })
