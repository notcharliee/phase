import { botCommand, BotCommandBuilder } from "phasebot"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"

import { PhaseColour, PhaseURL } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("help")
    .setDescription("Having trouble? We can help!"),
  (client, interaction) => {
    interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel("Documentation")
            .setStyle(ButtonStyle.Link)
            .setURL(PhaseURL.PhaseDocs),
          new ButtonBuilder()
            .setLabel("Support")
            .setStyle(ButtonStyle.Link)
            .setURL(PhaseURL.PhaseSupport),
        ),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(
            "You can read our docs or ask the team directly using the buttons below!",
          )
          .setTitle("Need some help?"),
      ],
    })
  },
)
