import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("list")
  .setDescription("Lists all the tags in the server.")
  .setExecute(async (interaction) => {
    const tagDoc = (await (db.tags.findOne({ guild: interaction.guildId }) ??
      db.tags.create({
        guild: interaction.guildId,
        tags: [],
      })))!

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle(`Tag List (${tagDoc.tags.length})`)
          .setDescription(
            tagDoc.tags.length
              ? tagDoc.tags.map(({ name }) => name).join(", ")
              : "No tags found.",
          ),
      ],
    })
  })
