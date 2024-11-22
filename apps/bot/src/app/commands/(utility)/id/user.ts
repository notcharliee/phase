import { BotSubcommandBuilder } from "@phasejs/core/builders"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gets the ID of a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to get the ID of.")
      .setRequired(true),
  )
  .setExecute((interaction) => {
    const id = interaction.options.getUser("user", true).id

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
