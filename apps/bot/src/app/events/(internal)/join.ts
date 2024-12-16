import { BotEventBuilder } from "@phasejs/builders"

import { EntryType } from "@plugin/blacklist"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

export default new BotEventBuilder()
  .setName("ready")
  .setListenerType("once")
  .setExecute(async (client) => {
    client.phase.emitter.on("blacklist.joinPrevented", async (entry) => {
      const alertMessage = new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Destructive")
          .setTitle("Server join prevented")
          .setTimestamp()
          .setDescription(
            `
              The bot was blocked from joining a server because its ${entry.type === EntryType.User ? "owner" : "ID"} was found on the ${entry.type} blacklist.

              **Blacklisted ${entry.type}:**
              ${entry.id}

              **Reason for blacklist:**
              ${entry.reason ?? "No reason provided"}
            `,
          )
      })

      try {
        await alertWebhook.send(alertMessage)
      } catch (error) {
        console.log("Failed to send alert message:")
        console.error(error)
      }
    })

    client.phase.emitter.on("blacklist.joinSuccess", async (guild) => {
      const guildId = guild.id
      const ownerId = guild.ownerId
      const owner = await guild.fetchOwner().catch(() => null)

      await db.guilds.create({ id: guildId, admins: [ownerId] })

      const ownedGuildsCount = client.guilds.cache.filter(
        (g) => ownerId === g.ownerId,
      ).size

      const alertMessage = new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Bot was added")
          .setThumbnail(guild.iconURL())
          .setTimestamp()
          .setDescription(
            `
              **Name:** \`${guild.name}\`
              **Created:** <t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>
              **Membercount:** \`${guild.memberCount}\`
              **ID:** \`${guild.id}\`

              **Owner Name:** \`${owner?.user.username ?? "unknown"}\`
              **Owner ID:** \`${ownerId}\`
              **Owned Phase Servers:** \`${ownedGuildsCount}\`
            `,
          )
      })

      try {
        await alertWebhook.send(alertMessage)
      } catch (error) {
        console.log("Failed to send alert message:")
        console.error(error)
      }
    })
  })
