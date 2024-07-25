import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour, PhaseURL } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("help")
  .setDescription("Links to the bot's docs and support discord.")
  .setExecute(async (interaction) => {
    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Help")
          .setDescription(
            "You can read our docs or ask the team directly using the buttons below!",
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel("Documentation")
            .setStyle(ButtonStyle.Link)
            .setURL(PhaseURL.PhaseDocs),
          new ButtonBuilder()
            .setLabel("Support Discord")
            .setStyle(ButtonStyle.Link)
            .setURL(PhaseURL.PhaseSupport),
        ),
      ],
    })
  })
