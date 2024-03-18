import { botEvent } from "phasebot"

import {
  GuildSchema,
  ReminderSchema,
  TagSchema,
  LevelSchema,
} from "@repo/schemas"

import { alertDevs } from "~/utils"

export default botEvent("guildDelete", async (client, guild) => {
  const guildSchema = await GuildSchema.findOne({ id: guild.id })
  if (!guildSchema) return

  await guildSchema.deleteOne()
  await ReminderSchema.deleteMany({ guild: guild.id })
  await TagSchema.deleteMany({ guild: guild.id })
  await LevelSchema.deleteMany({ guild: guild.id })

  await alertDevs({
    title: "Bot kicked from guild",
    description: `**New Guild Count:** \`${client.guilds.cache.size}\``,
    type: "message",
  })
})
