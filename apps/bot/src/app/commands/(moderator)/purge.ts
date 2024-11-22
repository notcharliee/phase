import { chatInputApplicationCommandMention } from "discord.js"
import { BotCommandBuilder } from "@phasejs/core/builders"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotCommandBuilder()
  .setName("purge")
  .setDescription("Bulk deletes recent messages.")
  .setDMPermission(false)
  .addIntegerOption((option) =>
    option
      .setName("limit")
      .setDescription("The number of messages to fetch (max 100).")
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
    await interaction.deferReply({ ephemeral: true })

    const limit = interaction.options.getInteger("limit", true)
    const author = interaction.options.getUser("author", false)

    const channel = interaction.guild!.channels.resolve(interaction.channelId)!
    if (!channel.isSendable()) return

    let fetchedMessages = await channel.messages
      .fetch({ limit, cache: false })
      .catch(() => null)

    if (!fetchedMessages) {
      return void interaction.editReply(
        new BotErrorMessage("Failed to fetch messages."),
      )
    }

    if (author) {
      fetchedMessages = fetchedMessages.filter(
        ({ author: { id } }) => id === author.id,
      )
    }

    const deletedMessages = fetchedMessages.size
      ? await channel.bulkDelete(fetchedMessages, true).catch(() => null)
      : null

    if (!deletedMessages?.size) {
      const scrubCommandMention = chatInputApplicationCommandMention(
        "scrub",
        interaction.client.application.commands.cache.find(
          (command) => command.name === "scrub",
        )!.id,
      )

      return void interaction.editReply(
        new BotErrorMessage(
          `No recent messages were found. If you want to purge the entire channel, run ${scrubCommandMention} instead.`,
        ),
      )
    }

    return void interaction.editReply(
      `Purged **${deletedMessages.size}** messages` +
        (author ? ` sent by <@${author.id}>` : "."),
    )
  })
