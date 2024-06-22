import { BotCommandBuilder } from "phasebot/builders"

import facts from "./_data/catfacts.json"

export default new BotCommandBuilder()
  .setName("catfact")
  .setDescription("Gives you an interesting fact about cats.")
  .setExecute(async (interaction) => {
    interaction.reply(facts[Math.floor(Math.random() * facts.length)])
  })
