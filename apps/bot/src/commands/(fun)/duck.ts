import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotCommandBuilder()
  .setName("duck")
  .setDescription("Gives you a random picture of a duck.")
  .setExecute(async (interaction) => {
    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Duck")
          .setColor(PhaseColour.Primary)
          .setImage("https://random-d.uk/api/randomimg?t=" + Date.now()),
      ],
    })
  })
