import { botCommand, BotCommandBuilder } from "phase.js"
import { PhaseColour } from "~/utils"
import { EmbedBuilder } from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("cat")
    .setDescription("Finds a random picture of a cat."),
  (client, interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Cat")
          .setColor(PhaseColour.Primary)
          .setImage("https://cataas.com/cat?t=" + Date.now()),
      ],
    })
  },
)
