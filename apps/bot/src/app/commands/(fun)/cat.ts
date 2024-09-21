import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotCommandBuilder()
  .setName("cat")
  .setDescription("Gives you a random picture of a cat.")
  .setExecute(async (interaction) => {
    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Cat")
          .setColor(PhaseColour.Primary)
          .setImage("https://cataas.com/cat?t=" + Date.now()),
      ],
    })
  })
