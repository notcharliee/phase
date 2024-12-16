import { BotCommandBuilder } from "@phasejs/builders"

const DICE = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"] as const
const DEFAULT_DICE = "d6" satisfies (typeof DICE)[number]
const DEFAULT_AMOUNT = 1

export default new BotCommandBuilder()
  .setName("diceroll")
  .setDescription("Rolls a die (supports multiple sides).")
  .addStringOption((option) => {
    return option
      .setName("sides")
      .setDescription("The number of sides on the die (defaults to d6).")
      .setRequired(false)
      .addChoices(DICE.map((d) => ({ name: d, value: d })))
  })
  .addIntegerOption((option) => {
    return option
      .setName("amount")
      .setDescription("How many dice to roll (defaults to 1).")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(10)
  })
  .setExecute(async (interaction) => {
    const sides = interaction.options.getString("sides") ?? DEFAULT_DICE
    const amount = interaction.options.getInteger("amount") ?? DEFAULT_AMOUNT

    const results = Array.from({ length: amount }).map(
      () => Math.floor(Math.random() * +sides.slice(1)) + 1,
    )

    return void interaction.reply(`You rolled ${results.join(", ")}.`)
  })
