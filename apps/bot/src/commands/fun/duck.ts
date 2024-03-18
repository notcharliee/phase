import { botCommand, BotCommandBuilder } from "phasebot"
import { PhaseColour } from "~/utils"
import { EmbedBuilder } from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("duck")
    .setDescription("Finds a random picture of a duck."),
  (client, interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Duck")
          .setColor(PhaseColour.Primary)
          .setImage("https://random-d.uk/api/randomimg?t=" + Date.now()),
      ],
    })
  },
)
