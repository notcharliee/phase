import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { errorMessage, PhaseColour } from "~/utils"

export default new BotCommandBuilder()
  .setName("purge")
  .setDescription("Purges up to 100 messages from the channel at a time.")
  .setDMPermission(false)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The number of messages to purge.")
      .setMaxValue(100)
      .setMinValue(1)
      .setRequired(true),
  )
  .addUserOption((option) =>
    option
      .setName("author")
      .setDescription("The author of the messages.")
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    const amount = interaction.options.getInteger("amount", true)
    const author = interaction.options.getUser("author", false)

    const channel = interaction.channel as GuildTextBasedChannel

    let fetchedMessages = await channel.messages.fetch({ limit: amount })

    if (author) {
      fetchedMessages = fetchedMessages.filter(
        (message) => message.author.id == author.id,
      )
    }

    const deletedMessages = await channel.bulkDelete(fetchedMessages, true)

    if (!deletedMessages.size) {
      return interaction.reply(
        errorMessage({
          title: "Messages Not Found",
          description:
            "No messages were found.\n\n**Developer Note:**\nDiscord doesn't allow bots to purge (bulk delete) messages that older than 14 days. If you need to purge the entire channel, run `/scrub` instead.",
        }),
      )
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(
            `Purged **${deletedMessages.size}** messages in total` +
              `${author ? ` sent by ${author}` : "."}`,
          )
          .setTitle("Messages Purged"),
      ],
    })
  })
