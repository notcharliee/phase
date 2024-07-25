import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("get")
  .setDescription("Gets a tag by name.")
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
        new BotError(
          "Could not find a tag by that name. Make sure you typed it in correctly and try again.",
        ).toJSON(),
      )

      return
    }

    void interaction.reply(tagDoc.tags[tagIndex].value)
  })
