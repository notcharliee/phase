import { BotEventBuilder } from "@phasejs/core/builders"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

export default new BotEventBuilder()
  .setName("guildDelete")
  .setExecute(async (client, guild) => {
    const existsInDatabase = client.stores.guilds.has(guild.id)

    // means the guild is blacklisted so was auto removed
    if (!existsInDatabase) return

    const alertMessage = new MessageBuilder().setEmbeds((embed) => {
      return embed
        .setColor("Primary")
        .setTitle("Bot was kicked")
        .setThumbnail(guild.iconURL())
        .setDescription(
          `
            **Name:** \`${guild.name}\`
            **ID:** \`${guild.id}\`
          `,
        )
        .setTimestamp()
    })

    try {
      await alertWebhook.send(alertMessage)
    } catch (error) {
      console.log("Failed to send alert message:")
      console.error(error)
    }

    try {
      await Promise.all([
        db.guilds.deleteOne({ id: guild.id }),
        db.giveaways.deleteMany({ guild: guild.id }),
        db.levels.deleteMany({ guild: guild.id }),
        db.otps.deleteMany({ guildId: guild.id }),
        db.reminders.deleteMany({ guild: guild.id }),
        db.tags.deleteMany({ guild: guild.id }),
      ])
    } catch (error) {
      console.log("Failed to delete server data from database:")
      console.error(error)
    }
  })
