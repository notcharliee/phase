import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotCommandBuilder()
  .setName("purge")
  .setDescription("Bulk deletes messages from the channel.")
  .setDMPermission(false)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The number of messages to purge (max 100).")
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

    let fetchedMessages = await channel.messages.fetch({ limit: amount }).catch(() => null)

    if (author) {
      fetchedMessages = fetchedMessages?.filter(
        (message) => message.author.id == author.id,
      ) ?? null
    }

    const deletedMessages = fetchedMessages ? await channel.bulkDelete(fetchedMessages, true).catch(() => null) : null

    if (!deletedMessages?.size) {
      const commandMention = `</scrub:${interaction.client.application.commands.cache.find((command) => command.name === "scrub")!.id}>`

      void interaction.reply(
        new BotError({
          title: "Messages Not Found",
          description: dedent`
            No messages were found.
            
            -# **Note:** Discord doesn't allow bots to bulk delete messages that older than 2 weeks. If you need to purge the entire channel, run ${commandMention} instead.
          `,
        }).toJSON(),
      )

      return
    }

    void interaction.reply({
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
