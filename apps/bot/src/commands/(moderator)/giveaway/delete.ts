import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

import type { GuildTextBasedChannel } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("delete")
  .setDescription("Deletes a giveaway.")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("The ID of the giveaway.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    const id = interaction.options.getString("id", true)
    const giveaway = await db.giveaways.findOne({ id })

    if (!giveaway) {
      void interaction.editReply(
        new BotError(
          "No giveaway exists with that ID. Make sure you typed it in correctly and try again.",
        ).toJSON(),
      )

      return
    }

    void giveaway.deleteOne()

    const channel = interaction.client.channels.cache.get(giveaway.channel) as
      | GuildTextBasedChannel
      | undefined

    if (channel) {
      const message = await channel.messages
        .fetch(giveaway.id)
        .catch(() => null)
      if (message) void message.delete()
    }

    void interaction.editReply("The giveaway has been deleted.")
  })
