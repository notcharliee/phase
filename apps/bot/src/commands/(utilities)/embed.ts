import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotCommandBuilder()
  .setName("embed")
  .setDescription("Opens the Phase Embed Builder.")
  .setExecute((interaction) => {
    interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId("embedbuilder.author")
            .setLabel("Edit Author")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("embedbuilder.body")
            .setLabel("Edit Body")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("embedbuilder.image")
            .setLabel("Edit Image")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("embedbuilder.footer")
            .setLabel("Edit Footer")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("embedbuilder.send")
            .setLabel("Send Embed")
            .setStyle(ButtonStyle.Success),
        ),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(
            "Use the buttons below to edit this embed, then hit Send Embed when finished.",
          )
          .setTitle("Embed Builder"),
      ],
    })
  })
