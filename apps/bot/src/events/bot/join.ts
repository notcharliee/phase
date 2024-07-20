import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { alertDevs } from "~/lib/utils"

export default botEvent("guildCreate", async (client, guild) => {
  const guildSchema = await db.guilds.findOne({ id: guild.id })
  if (guildSchema) return

  await new db.guilds({
    id: guild.id,
    admins: [guild.ownerId],
    news_channel: null,
  }).save()

  await alertDevs({
    title: "New guild",
    description: `**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Members:** \`${guild.memberCount}\`\n\n**New Guild count:** \`${client.guilds.cache.size}\``,
    type: "message",
  })
})
