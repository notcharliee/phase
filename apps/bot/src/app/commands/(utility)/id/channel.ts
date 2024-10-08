import { BotSubcommandBuilder } from "phasebot/builders"

export default new BotSubcommandBuilder()
  .setName("channel")
  .setDescription("Gets the ID of a channel.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to get the ID of.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute((interaction) => {
    const id = interaction.options.getChannel("channel", true).id

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
