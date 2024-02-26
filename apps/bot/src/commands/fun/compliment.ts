import { botCommand, BotCommandBuilder } from "phase.js"
import compliments from "./_data/compliments.json" assert { type: "json" }

export default botCommand(
  new BotCommandBuilder()
    .setName("compliment")
    .setDescription("Gives you a compliment."),
  (client, interaction) => {
    interaction.reply(
      compliments[Math.floor(Math.random() * compliments.length)],
    )
  },
)
