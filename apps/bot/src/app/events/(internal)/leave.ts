import { BotEventBuilder } from "@phasejs/core/builders"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

export default new BotEventBuilder()
  .setName("guildDelete")
  .setExecute(async (client, guild) => {
    const existsInDatabase = client.stores.guilds.has(guild.id)

    // means the guild is blacklisted so was auto removed (see ./join.ts)
    if (!existsInDatabase) return

    try {
      await alertWebhook.send(
        new MessageBuilder().setEmbeds((embed) => {
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
        }),
      )
    } catch (error) {
      console.error(error)
    }

    Promise.all([
      db.guilds.deleteOne({ id: guild.id }),
      db.giveaways.deleteMany({ guild: guild.id }),
      db.levels.deleteMany({ guild: guild.id }),
      db.otps.deleteMany({ guildId: guild.id }),
      db.reminders.deleteMany({ guild: guild.id }),
      db.tags.deleteMany({ guild: guild.id }),
    ]).catch(console.error)
  })
