import { BotSubcommandBuilder } from "@phasejs/builders"

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
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.options.getString("name", true)

    const tagDoc = await db.tags.findOne({
      guild: interaction.guildId,
    })

    if (!tagDoc?.tags.find((tag) => tag.name == name)) {
      return void interaction.editReply(
        new BotErrorMessage(
          "Could not find a tag by that name. Make sure you typed it in correctly and try again.",
        ),
      )
    }

    await tagDoc.updateOne({ $pull: { tags: { name } } })

    return void interaction.editReply(
      `Removed tag \`${name}\` from the server.`,
    )
  })
