import { BotCommandBuilder } from "phasebot/builders"

import compliments from "./_data/compliments.json"

export default new BotCommandBuilder()
  .setName("compliment")
  .setDescription("Gives you a compliment.")
  .setExecute(async (interaction) => {
    void interaction.reply(
      compliments[Math.floor(Math.random() * compliments.length)]!,
    )
  })
