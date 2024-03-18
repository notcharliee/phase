import { botEvent } from "phasebot"
import { GuildSchema } from "@repo/schemas"
import {
  PhaseColour,
  errorMessage,
  memberNotFound,
  moduleNotEnabled,
} from "~/utils"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (
    !interaction.isButton() ||
    !interaction.inGuild() ||
    (!interaction.customId.startsWith("form.accept.") &&
      !interaction.customId.startsWith("form.reject."))
  ) {
    return
  }

  await interaction.deferReply()

  const guildSchema = await GuildSchema.findOne({ id: interaction.guildId })
  const moduleConfig = guildSchema?.modules?.Forms

  if (!moduleConfig?.enabled) {
    return interaction.editReply(moduleNotEnabled("Forms"))
  }

  const form = moduleConfig.forms.find(
    (form) => form.id === interaction.customId.split(".")[2],
  )

  if (!form) {
    return interaction.editReply(
      errorMessage({
        title: "Form not found",
        description:
          "Could not find the form associated with this button. It may have been deleted.",
        ephemeral: true,
      }),
    )
  }

  const member = await interaction.guild?.members.fetch(
    interaction.customId.split(".")[3],
  )

  if (!member) {
    return interaction.editReply(memberNotFound())
  }

  const action =
    interaction.customId.split(".")[1] === "accept" ? "accepted" : "rejected"

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Form submission " + action)
        .setDescription(
          `${member}'s form submission for \`${form.name}\` has been ${action} by ${interaction.member}`,
        )
        .setColor(PhaseColour.Primary),
    ],
  })

  interaction.message.edit({
    embeds: interaction.message.embeds,
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`form.accept.${form.id}.${member.id}`)
          .setLabel("Accept")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`form.reject.${form.id}.${member.id}`)
          .setLabel("Reject")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
      ),
    ],
  })

  member.send({
    embeds: [
      new EmbedBuilder()
        .setTitle("Form submission " + action)
        .setDescription(
          `Your form submission for \`${form.name}\` has been ${action} by ${interaction.member}`,
        )
        .setColor(PhaseColour.Primary)
        .setFooter({
          iconURL: interaction.guild?.iconURL() ?? undefined,
          text: `Sent from ${interaction.guild!.name}`,
        }),
    ],
  })
})
