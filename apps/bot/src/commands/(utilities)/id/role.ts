import { BotSubcommandBuilder } from "phasebot/builders"

export default new BotSubcommandBuilder()
  .setName("role")
  .setDescription("Gets the ID of a role.")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The role to get the ID of.")
      .setRequired(true),
  )
  .setExecute((interaction) => {
    const id = interaction.options.getRole("role", true).id

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
