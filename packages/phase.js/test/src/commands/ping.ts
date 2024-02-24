import { botCommand, BotCommandBuilder } from "~/index"


export default botCommand (
  new BotCommandBuilder()
  .setName("ping")
  .setDescription("pong"),
  (client, interaction) => {
    return interaction.reply("pong")
  }
)
