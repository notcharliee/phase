import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("delete")
  .setDescription("Deletes a tag.")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("The name of the tag.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const tagDoc = (await (db.tags.findOne({ guild: interaction.guildId }) ??
      db.tags.create({
        guild: interaction.guildId,
        tags: [],
      })))!

    const name = interaction.options.getString("name", true)
    const tagIndex = tagDoc.tags.findIndex((tag) => tag.name == name)

    if (tagIndex == -1) {
      void interaction.reply(
        new BotErrorMessage(
          "Could not find a tag by that name. Make sure you typed it in correctly and try again.",
        ).toJSON(),
      )

      return
    }

    tagDoc.tags.splice(tagIndex, 1)

    void tagDoc.save()

    void interaction.reply({
      content: `Removed tag \`${name}\` from the server.`,
      ephemeral: true,
    })
  })
