import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCommandBuilder, botCommand } from "phasebot"
import { errorMessage } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("nuke")
    .setDescription(
      "Deletes the current channel and creates an exact copy with no messages.",
    )
    .setDMPermission(false),
  async (client, interaction) => {
    if (interaction.channel?.isThread()) {
      interaction.reply(
        errorMessage({
          title: "Invalid Channel",
          description: "This command cannot be used in threads.",
        }),
      )
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Yellow")
          .setDescription(
            `This command will delete ${interaction.channel}, then create a new channel with the same settings. All message history will be lost forever.\n\nAny bots, webhooks, or third-party applications currently connected to ${interaction.channel} will not be transferred to the new channel. You will need to reconnect them manually.\n\nThis action is irreversible, are you absolutely sure you wish to proceed?`,
          )
          .setTitle("⚠️ Warning"),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`nuke.proceed`)
              .setLabel("Nuke")
              .setStyle(ButtonStyle.Danger),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`nuke.abort`)
              .setLabel("Abort")
              .setStyle(ButtonStyle.Secondary),
          ),
      ],
    })
  },
)
