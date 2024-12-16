import { BotSubcommandBuilder } from "@phasejs/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

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
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.options.getString("name", true)
    const value = interaction.options.getString("value", true)

    const tagDoc =
      (await db.tags.findOne({
        guild: interaction.guildId,
      })) ?? (await db.tags.create({ guild: interaction.guildId, tags: [] }))

    const tagAlreadyExists = !!tagDoc.tags.find((tag) => tag.name == name)

    if (tagAlreadyExists) {
      return void interaction.editReply(
        new BotErrorMessage(
          `A tag already exists with that name. Use </tag edit:${interaction.id}> instead.`,
        ),
      )
    }

    await tagDoc.updateOne({ $push: { tags: { name, value } } })

    return void interaction.editReply(`Added tag \`${name}\` to the server.`)
  })
