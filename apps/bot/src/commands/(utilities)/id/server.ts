import { BotSubcommandBuilder } from "phasebot/builders"

export default new BotSubcommandBuilder()
  .setName("server")
  .setDescription("Gets the ID of the server.")
  .setExecute((interaction) => {
    const id = interaction.guildId!

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
