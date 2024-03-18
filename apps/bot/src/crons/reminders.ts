import { botCronJob } from "phasebot"
import { ReminderSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"
import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botCronJob("*/5 * * * * *", async (client) => {
  // Fetch reminders that meet the specified conditions
  const reminders = await ReminderSchema.find({
    $or: [
      {
        $expr: {
          $lt: [{ $add: [{ $toLong: "$created" }, "$time"] }, Date.now()],
        },
      },
      {
        unsent: true,
        created: { $lt: new Date(Date.now()) },
      },
    ],
  })

  for (const reminder of reminders) {
    const channel = client.channels.cache.get(
      reminder.channel,
    ) as GuildTextBasedChannel

    if (!channel) {
      // If the channel doesn't exist, delete the reminder and continue to the next one
      await reminder.deleteOne()
      continue
    }

    const createdDate = reminder.created

    // Extract date and time components from the created date
    const year = createdDate.getUTCFullYear()
    const month = ("0" + (createdDate.getUTCMonth() + 1)).slice(-2)
    const day = ("0" + createdDate.getUTCDate()).slice(-2)
    const hours = ("0" + createdDate.getUTCHours()).slice(-2)
    const minutes = ("0" + createdDate.getUTCMinutes()).slice(-2)

    await channel
      .send({
        content: reminder.role
          ? `<@&${reminder.role}>`
          : reminder.user
            ? `<@${reminder.user}>`
            : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle(reminder.name ?? "Reminder")
            .setDescription(reminder.message)
            .setColor(PhaseColour.Primary)
            .setFooter(
              !reminder.loop
                ? {
                    text: `Created ${year}/${month}/${day} ${hours}:${minutes}`,
                  }
                : null,
            ),
        ],
      })
      .catch(() => null)

    if (reminder.loop) {
      // If the reminder is set to loop, mark it as sent and update the created date
      if (reminder.unsent) reminder.unsent = false
      reminder.created = new Date()

      await reminder.save()
    } else {
      // If the reminder is not set to loop, delete it
      await reminder.deleteOne()
    }
  }
})
