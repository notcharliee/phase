import { BotCommandBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { PhaseColour } from "~/lib/enums"

import type { GuildTextBasedChannel } from "discord.js"

export default new BotCommandBuilder()
  .setName("announce")
  .setDescription("Sends an embedded announcement message as the bot.")
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The announcement message.")
      .setMaxLength(4000)
      .setRequired(true),
  )
  .addRoleOption((option) =>
    option
      .setName("mention")
      .setDescription("What role to ping.")
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    await (interaction.channel as GuildTextBasedChannel).send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.displayName,
          })
          .setColor(PhaseColour.Primary)
          .setDescription(interaction.options.getString("message", true))
          .setTimestamp(),
      ],
    })

    void interaction.reply({
      content: "Announcement was sent successfully.",
      ephemeral: true,
    })
  })
