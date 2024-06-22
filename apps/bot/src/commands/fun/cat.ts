import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/utils"

export default new BotCommandBuilder()
  .setName("cat")
  .setDescription("Finds a random picture of a cat.")
  .setExecute(async (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Cat")
          .setColor(PhaseColour.Primary)
          .setImage("https://cataas.com/cat?t=" + Date.now()),
      ],
    })
  })
