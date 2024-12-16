import { BotSubcommandBuilder } from "@phasejs/builders"

export default new BotSubcommandBuilder()
  .setName("role")
  .setDescription("Gets the ID of a role.")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The role to get the ID of.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute((interaction) => {
    const id = interaction.options.getRole("role", true).id

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
