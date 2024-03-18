import { botEvent } from "phasebot"
import { errorMessage, PhaseError, PhaseColour } from "~/utils"
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (
    interaction.isButton() &&
    /nuke\.(proceed|abort)/.test(interaction.customId)
  ) {
    const customIdParts = interaction.customId.split(".")
    const nukeAction = customIdParts[1] as "proceed" | "abort"

    if (!interaction.channel || interaction.channel.isDMBased()) return

    if (interaction.user.id != interaction.message.interaction?.user.id) {
      return interaction.reply(
        errorMessage({
          title: "Access Denied",
          description: PhaseError.AccessDenied,
          ephemeral: true,
        }),
      )
    }

    if (interaction.channel.isThread()) {
      return interaction.reply(
        errorMessage({
          title: "Invalid Channel",
          description: "This command cannot be used in threads.",
        }),
      )
    }

    await interaction.deferUpdate()

    if (nukeAction == "proceed") {
      if (interaction.channel.isTextBased()) {
        const newChannel = await interaction.channel.clone({
          reason: `${interaction.user} ran /nuke`,
        })

        await newChannel.send({
          content: `${interaction.user}`,
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setDescription(
                `#${interaction.channel.name} was successfully nuked.`,
              )
              .setTitle("Channel Nuked"),
          ],
        })

        await interaction.channel.delete(`${interaction.user} ran /nuke`)
      }
    } else {
      interaction.message.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`nuke.proceed`)
                .setDisabled(true)
                .setLabel("Nuke")
                .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`nuke.abort`)
                .setDisabled(true)
                .setLabel("Abort")
                .setStyle(ButtonStyle.Secondary),
            ),
        ],
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(`Aborted channel nuke. Phew!`)
            .setTitle("Nuke Aborted"),
        ],
      })
    }
  }
})
