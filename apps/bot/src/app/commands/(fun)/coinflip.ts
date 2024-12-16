import { BotCommandBuilder } from "@phasejs/builders"

export default new BotCommandBuilder()
  .setName("coinflip")
  .setDescription("Flips a coin.")
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const commonResponses = ["It's **Heads**!", "It's **Tails**!"]

    const rareResponses = [
      "The coin landed on its side :/",
      "The outcome was decided long before you flipped the coin...\n-# It's **Heads** though.",
      "Coin flips are just chaos wrapped in the illusion of choice...\n-# It’s **Tails** though.",
      "Nothing is ever truly random, it’s all just angles, force, and gravity...\n-# It’s **Heads** though.",
    ]

    const random = Math.floor(Math.random() * 250)

    const response =
      random < 10
        ? rareResponses[Math.floor(Math.random() * rareResponses.length)]!
        : commonResponses[Math.floor(Math.random() * commonResponses.length)]!

    return void interaction.editReply(response)
  })
