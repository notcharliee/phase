import { BotCronBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

import type { mongoose, Reminder } from "~/lib/db"
import type { GuildTextBasedChannel, MessageCreateOptions } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/10 * * * * *") // every 10 seconds
  .setExecute(async (client) => {
    const now = new Date(Date.now())

    const reminderDocs = await db.reminders.find({
      scheduledAt: { $lt: now },
    })

    const reminderDocWriteOps: mongoose.AnyBulkWriteOperation<Reminder>[] = []

    const reminderMessagesToSend: [
      GuildTextBasedChannel,
      MessageCreateOptions,
    ][] = []

    for (const reminderDoc of reminderDocs) {
      const channel = client.channels.cache.get(reminderDoc.channel) as
        | GuildTextBasedChannel
        | undefined

      if (!channel) {
        reminderDocWriteOps.push({
          deleteOne: { filter: { _id: reminderDoc._id } },
        })

        continue
      }

      reminderMessagesToSend.push([
        channel,
        {
          content: reminderDoc.mention,
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle(reminderDoc.name)
              .setDescription(reminderDoc.content)
              .setTimestamp(reminderDoc.createdAt),
          ],
        },
      ])

      if (reminderDoc.loop) {
        reminderDocWriteOps.push({
          updateOne: {
            filter: { _id: reminderDoc._id },
            update: {
              $set: {
                scheduledAt: new Date(now.getTime() + reminderDoc.delay),
              },
            },
          },
        })
      } else {
        reminderDocWriteOps.push({
          deleteOne: { filter: { _id: reminderDoc._id } },
        })
      }
    }

    if (reminderMessagesToSend.length) {
      await Promise.all(
        reminderMessagesToSend.map(([channel, options]) =>
          channel.send(options).catch((error) => {
            console.error(
              `Failed to send a reminder to channel ${channel.id} in guild ${channel.guildId}:`,
              error,
            )
          }),
        ),
      )
    }

    if (reminderDocWriteOps.length) {
      await db.reminders.bulkWrite(reminderDocWriteOps)
    }
  })
