import { slashCommand } from "~/index"

import { SlashCommandBuilder } from "discord.js"

export default slashCommand (
  new SlashCommandBuilder()
  .setName("ping")
  .setDescription("pong"),
  (interaction, client) => {
    return interaction.reply("pong")
  }
)
