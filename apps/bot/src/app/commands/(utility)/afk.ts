import { BotCommandBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotCommandBuilder()
  .setName("afk")
  .setDescription("Sets your AFK status.")
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Give a reason for going AFK.")
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    const reason =
      interaction.options.getString("reason", false) ?? "No reason set."

    const afkSchema = await db.afks.findOne({ user: interaction.user.id })

    if (afkSchema) {
      afkSchema.reason = reason
      void afkSchema.save()
    } else {
      void db.afks.create({
        user: interaction.user.id,
        reason,
      })
    }

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(reason)
          .setTitle("AFK Status Changed"),
      ],
    })
  })
