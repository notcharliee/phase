import { EmbedBuilder, GuildChannel } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { errorMessage, PhaseColour } from "~/utils"

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
      interaction.reply(
        errorMessage({
          title: "Invalid Channel",
          description: "This command cannot be used in threads.",
        }),
      )
    }

    if (state) {
      if (channel.isTextBased())
        channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, {
          SendMessages: false,
        })
      if (channel.isVoiceBased())
        channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, {
          Speak: false,
        })

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              `Channel has been locked for ${role ?? "@everyone"}.`,
            )
            .setTitle("Channel Locked"),
        ],
      })
    } else {
      if (channel.isTextBased())
        channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, {
          SendMessages: true,
        })
      if (channel.isVoiceBased())
        channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, {
          Speak: true,
        })

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              `Channel has been unlocked for ${role ?? "@everyone"}.`,
            )
            .setTitle("Channel Unlocked"),
        ],
      })
    }
  })
