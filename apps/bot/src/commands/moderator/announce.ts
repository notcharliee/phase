import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { alertDevs, errorMessage, PhaseColour, PhaseError } from "~/utils"

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
    try {
      await interaction.channel?.send({
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

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription("Announcement was created successfully.")
            .setTitle("Announcement Sent"),
        ],
        ephemeral: true,
      })
    } catch (error) {
      alertDevs({
        title: `Command Failure: /${interaction.commandName}`,
        description: JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2,
        ),
        type: "warning",
      })

      interaction.reply(
        errorMessage({
          title: "Something went wrong",
          description: PhaseError.Unknown,
        }),
      )
    }
  })
