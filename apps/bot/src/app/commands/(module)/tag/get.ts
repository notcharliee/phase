import { BotSubcommandBuilder } from "@phasejs/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

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
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.options.getString("name")

    const tagDoc = await db.tags.findOne({
      guild: interaction.guildId,
    })

    const tag = tagDoc?.tags.find((tag) => tag.name == name)

    if (!tag) {
      return void interaction.editReply(
        new BotErrorMessage(
          "Could not find a tag by that name. Make sure you typed it in correctly and try again.",
        ),
      )
    }

    return void interaction.editReply(tag.value)
  })
