import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("echo")
  .setDescription("Echoes the text you give it.")
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("The text to echo.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const text = interaction.options.getString("text", true)
    void interaction.reply(text)
  })
