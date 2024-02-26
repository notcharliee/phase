import { botCommand, BotCommandBuilder } from "phase.js"
import { PhaseColour } from "~/utils"
import { EmbedBuilder } from "discord.js"
import dogs from "./_data/dogs.json" assert { type: "json" }

export default botCommand(
  new BotCommandBuilder()
    .setName("dog")
    .setDescription("Finds a random picture of a dog."),
  (client, interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Dog")
          .setColor(PhaseColour.Primary)
          .setImage("https://random.dog/" + dogs[Math.floor(Math.random() * dogs.length)]),
      ],
    })
  },
)
