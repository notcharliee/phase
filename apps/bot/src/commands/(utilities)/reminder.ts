import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"
import { safeMs } from "~/lib/utils"

export default new BotCommandBuilder()
  .setName("reminder")
  .setDescription("Creates a reminder")
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The content to put in the reminder")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("delay")
      .setDescription("How long to wait before sending the reminder")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const message = interaction.options.getString("message", true)
    const delay = interaction.options.getString("delay", true)

    const msDelay = safeMs(delay)

    if (!msDelay) {
      return void interaction.reply(
        new BotError("The time you provided is invalid.").toJSON(),
      )
    }

    await db.reminders.create({
      name: "Reminder",
      guild: interaction.guildId,
      channel: interaction.channelId,
      content: message,
      delay: msDelay,
      mention: `${interaction.user}`,
    })

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Reminder Set")
          .setDescription("You'll be pinged when the reminder is sent.")
          .setFooter({ text: `Duration: ${safeMs(msDelay, { long: true })}` }),
      ],
    })
  })
