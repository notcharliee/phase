import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"

import { CustomMessageBuilder } from "~/structures/CustomMessageBuilder"

export default new BotSubcommandBuilder()
  .setName("list")
  .setDescription("Lists all the tags in the server.")
  .setExecute(async (interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const tagDoc = await db.tags.findOne({
      guild: interaction.guildId,
    })

    return void interaction.editReply(
      new CustomMessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle(`Tag List (${tagDoc?.tags.length ?? 0})`)
          .setDescription(
            tagDoc?.tags.length
              ? tagDoc.tags.map(({ name }) => name).join(", ")
              : "No tags found.",
          )
      }),
    )
  })
