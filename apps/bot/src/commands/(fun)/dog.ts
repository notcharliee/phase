import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"
import dogs from "./_data/dogs.json"

export default new BotCommandBuilder()
  .setName("dog")
  .setDescription("Finds a random picture of a dog.")
  .setExecute(async (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Random Dog")
          .setColor(PhaseColour.Primary)
          .setImage(
            "https://random.dog/" +
              dogs[Math.floor(Math.random() * dogs.length)],
          ),
      ],
    })
  })
