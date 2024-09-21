import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("create")
  .setDescription("Creates a tag.")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("The name of the tag.")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("value")
      .setDescription("The value of the tag.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const tagDoc = (await (db.tags.findOne({ guild: interaction.guildId }) ??
      db.tags.create({
        guild: interaction.guildId,
        tags: [],
      })))!

    const name = interaction.options.getString("name", true)
    const value = interaction.options.getString("value", true)

    const tagAlreadyExists = !!tagDoc.tags.find((tag) => tag.name == name)

    if (tagAlreadyExists) {
      void interaction.reply(
        new BotError(
          `A tag already exists with that name. Use </tag edit:${interaction.id}> instead.`,
        ).toJSON(),
      )

      return
    }

    tagDoc.tags.push({
      name,
      value,
    })

    void tagDoc.save()

    void interaction.reply({
      content: `Added tag \`${name}\` to the server.`,
      ephemeral: true,
    })
  })
