import { botCommand, BotCommandBuilder } from "phasebot"
import facts from "./_data/catfacts.json" assert { type: "json" }

export default botCommand(
  new BotCommandBuilder()
    .setName("catfact")
    .setDescription("Gives you an interesting fact about cats."),
  (client, interaction) => {
    interaction.reply(facts[Math.floor(Math.random() * facts.length)])
  },
)
