import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("coinflip")
  .setDescription("Flips a coin.")
  .setExecute(async (interaction) => {
    void interaction.reply(
      ["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)]!,
    )
  })
