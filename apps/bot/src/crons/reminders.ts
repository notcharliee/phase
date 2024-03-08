import { botCronJob } from "phase.js"

import { ReminderSchema } from "@repo/schemas"

import { PhaseColour } from "~/utils"

import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botCronJob("*/5 * * * * *", async (client) => {
  const reminders = await ReminderSchema.find({
    $expr: {
      $lt: [{ $add: [{ $toLong: "$created" }, "$time"] }, Date.now()],
    },
  })

  for (const reminder of reminders) {
    const channel = client.channels.cache.get(
      reminder.channel,
    ) as GuildTextBasedChannel

    if (!channel) {
      await reminder.deleteOne()
      continue
    }

    const createdDate = reminder.created

    const year = createdDate.getUTCFullYear()
    const month = ("0" + (createdDate.getUTCMonth() + 1)).slice(-2)
    const day = ("0" + createdDate.getUTCDate()).slice(-2)
    const hours = ("0" + createdDate.getUTCHours()).slice(-2)
    const minutes = ("0" + createdDate.getUTCMinutes()).slice(-2)

    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`

    await channel
      .send({
        content: reminder.role
          ? `<@&${reminder.role}>`
          : reminder.user
            ? `<@${reminder.user}>`
            : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle("Reminder")
            .setDescription(reminder.message)
            .setColor(PhaseColour.Primary)
            .setFooter({
              text: `Created ${formattedDate}`,
            }),
        ],
      })
      .catch(() => null)

    await reminder.deleteOne()
  }
})
