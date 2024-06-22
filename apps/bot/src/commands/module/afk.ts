import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { AFKSchema } from "@repo/schemas"

import { PhaseColour } from "~/utils"

export default new BotCommandBuilder()
  .setName("afk")
  .setDescription("Set your AFK status.")
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

    const afkSchema =
      (await AFKSchema.findOne({ user: interaction.user.id })) ??
      new AFKSchema({
        user: interaction.user.id,
        reason,
      })

    afkSchema.reason = reason
    await afkSchema.save()

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(reason)
          .setTitle("AFK Status Changed"),
      ],
    })
  })
