import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { alertDevs } from "~/lib/utils"

export default botEvent("guildDelete", async (client, guild) => {
  const guildSchema = await db.guilds.findOne({ id: guild.id })
  if (!guildSchema) return

  await Promise.all([
    guildSchema.deleteOne(),
    db.giveaways.deleteMany({ guild: guild.id }),
    db.levels.deleteMany({ guild: guild.id }),
    db.otps.deleteMany({ guildId: guild.id }),
    db.reminders.deleteMany({ guild: guild.id }),
    db.tags.deleteMany({ guild: guild.id }),
  ])

  alertDevs({
    title: "Bot kicked from guild",
    description: `**New Guild Count:** \`${client.guilds.cache.size}\``,
    type: "message",
  })
})
