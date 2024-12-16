import { BotEventBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

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

    try {
      await message.reply(
        new MessageBuilder().setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle("Bump Reminder")
            .setDescription(moduleConfig.initialMessage)
        }),
      )
    } catch (error) {
      const errMessage = `Failed to send a bump reminder in channel ${message.channelId} in guild ${message.guildId}:`
      console.error(errMessage)
      console.error(error)
    }
  })
