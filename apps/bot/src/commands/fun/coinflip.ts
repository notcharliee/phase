import { botCommand, BotCommandBuilder } from "phasebot"

export default botCommand(
  new BotCommandBuilder().setName("coinflip").setDescription("Flip a coin."),
  (client, interaction) => {
    interaction.reply(
      ["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)],
    )
  },
)
