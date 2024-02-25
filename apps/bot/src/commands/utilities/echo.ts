import { botCommand, BotCommandBuilder } from "phase.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("echo")
    .setDescription("Echoes the text you give it.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to echo.")
        .setRequired(true),
    ),
  (client, interaction) => {
    const text = interaction.options.getString("text", true)
    interaction.reply(text)
  },
)
