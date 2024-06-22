import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("coinflip")
  .setDescription("Flip a coin.")
  .setExecute(async (interaction) => {
    interaction.reply(
      ["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)],
    )
  })
