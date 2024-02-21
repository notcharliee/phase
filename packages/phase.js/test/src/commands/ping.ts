import { botCommand, BotCommandBuilder } from "~/index"


export default botCommand (
  new BotCommandBuilder()
  .setName("ping")
  .setDescription("pong"),
  (interaction, client) => {
    return interaction.reply("pong")
  }
)
