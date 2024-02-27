import { BotCommandBuilder, botCommand } from "phase.js"
import {
  missingPermission,
  PhaseColour,
  alertDevs,
  PhaseError,
  errorMessage,
} from "~/utils"
import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("announce")
    .setDescription("Sends an announcement-style message as Phase.")
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
    ),
  async (client, interaction) => {
    if (
      !interaction.memberPermissions?.has(PermissionFlagsBits.MentionEveryone)
    )
      return interaction.reply(
        missingPermission(PermissionFlagsBits.MentionEveryone),
      )

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
  },
)
