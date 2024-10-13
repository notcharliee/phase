import { EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (client, message) => {
    if (message.interaction?.commandName !== "bump") return

    const guildDoc = client.stores.guilds.get(message.guildId!)
    const moduleConfig = guildDoc?.modules?.[ModuleId.BumpReminders]

    if (!guildDoc || !moduleConfig?.enabled) return

    await db.reminders.create({
      name: "Bump Reminder",
      guild: message.guildId,
      channel: message.channelId,
      content: moduleConfig.reminderMessage,
      delay: moduleConfig.time,
      mention: moduleConfig.mention,
    })

    await message
      .reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setTitle("Bump Reminder")
            .setDescription(moduleConfig.initialMessage),
        ],
      })
      .catch((error) => {
        console.error(
          `Failed to send a bump reminder in channel ${message.channelId} in guild ${message.guildId}:`,
          error,
        )
      })
  })
