import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "@phasejs/core/builders"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

import type { GuildChannel } from "discord.js"

export default new BotCommandBuilder()
  .setName("lock")
  .setDescription("Locks and unlocks a channel.")
  .setDMPermission(false)
  .addBooleanOption((option) =>
    option
      .setName("state")
      .setDescription("The state of the channel lock.")
      .setRequired(true),
  )
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription(
        "Specify a role to lock access for (defaults to @everyone).",
      )
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    const channel = interaction.channel as GuildChannel
    const state = interaction.options.getBoolean("state", true)
    const role = interaction.options.getRole("role", false)

    if (channel.isThread()) {
      return await interaction.reply(
        new BotErrorMessage("This command cannot be used in threads.").toJSON(),
      )
    }

    if (state) {
      if (channel.isTextBased()) {
        await channel.permissionOverwrites.edit(
          role?.id ?? interaction.guildId!,
          {
            SendMessages: false,
          },
        )
      }

      if (channel.isVoiceBased()) {
        await channel.permissionOverwrites.edit(
          role?.id ?? interaction.guildId!,
          {
            Speak: false,
          },
        )
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              `Channel has been locked for ${role ? `<@${role.id}>` : "@everyone"}.`,
            )
            .setTitle("Channel Locked"),
        ],
      })
    } else {
      if (channel.isTextBased()) {
        await channel.permissionOverwrites.edit(
          role?.id ?? interaction.guildId!,
          {
            SendMessages: true,
          },
        )
      }

      if (channel.isVoiceBased()) {
        await channel.permissionOverwrites.edit(
          role?.id ?? interaction.guildId!,
          {
            Speak: true,
          },
        )
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              `Channel has been unlocked for ${role ? `<@${role.id}>` : "@everyone"}.`,
            )
            .setTitle("Channel Unlocked"),
        ],
      })
    }
  })
