import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("id")
  .setDescription("Get the ID of a user or role.")
  .addMentionableOption((option) =>
    option
      .setName("mention")
      .setDescription("The user or role to get the ID of.")
      .setRequired(true),
  )
  .setExecute((interaction) => {
    const mention = interaction.options.getMentionable("mention", true)

    if (mention && "id" in mention) {
      interaction.reply({
        content: mention.id,
        ephemeral: true,
      })
    } else {
      interaction.reply({
        content: "Could not find the ID of that user or role.",
        ephemeral: true,
      })
    }
  })
