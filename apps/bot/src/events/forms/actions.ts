import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default botEvent("interactionCreate", async (_, interaction) => {
  if (
    !interaction.isButton() ||
    !interaction.inGuild() ||
    (!interaction.customId.startsWith("form.accept.") &&
      !interaction.customId.startsWith("form.reject."))
  ) {
    return
  }

  await interaction.deferReply()

  const guildDoc = await cache.guilds.get(interaction.guildId!)
  const moduleConfig = guildDoc?.modules?.[ModuleId.Forms]

  if (!moduleConfig?.enabled) {
    return interaction.editReply(
      BotError.moduleNotEnabled(ModuleId.Forms).toJSON(),
    )
  }

  const form = moduleConfig.forms.find(
    (form) => form.id === interaction.customId.split(".")[2],
  )

  if (!form) {
    return interaction.editReply(
      new BotError(
        "Could not find the form associated with this button. It may have been deleted.",
      ).toJSON(),
    )
  }

  const member = await interaction.guild?.members.fetch(
    interaction.customId.split(".")[3]!,
  )

  if (!member) {
    return interaction.editReply(BotError.memberNotFound().toJSON())
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
