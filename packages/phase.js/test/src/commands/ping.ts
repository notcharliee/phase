import { botCommand } from "~/index"

import { SlashCommandBuilder } from "discord.js"

export default botCommand (
  new SlashCommandBuilder()
  .setName("ping")
  .setDescription("pong"),
  (interaction, client) => {
    return interaction.reply("pong")
  }
)
