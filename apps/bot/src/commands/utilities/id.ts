import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("id")
  .setDescription("id")
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("user")
      .setDescription("Gets the ID of a user.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to get the ID of.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("role")
      .setDescription("Gets the ID of a role.")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("The role to get the ID of.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("channel")
      .setDescription("Gets the ID of a channel.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to get the ID of.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("server").setDescription("Gets the ID of the server."),
  )
  .setExecute((interaction) => {
    const subcommand = interaction.options.getSubcommand()

    const id =
      subcommand === "server"
        ? interaction.guildId!
        : subcommand === "channel"
          ? interaction.options.getChannel("channel", true).id
          : subcommand === "role"
            ? interaction.options.getRole("role", true).id
            : interaction.options.getUser("user", true).id

    void interaction.reply({
      content: id,
      ephemeral: true,
    })
  })
