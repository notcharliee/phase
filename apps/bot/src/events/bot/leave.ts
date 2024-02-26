import { botEvent } from "phase.js"
import { GuildSchema } from "@repo/schemas"
import { alertDevs } from "~/utils"

export default botEvent("guildDelete", async (client, guild) => {
  const guildSchema = await GuildSchema.findOne({ id: guild.id })
  if (!guildSchema) return

  await guildSchema.deleteOne()

  await alertDevs ({
    title: "Bot kicked from guild",
    description: `**New Guild Count:** \`${client.guilds.cache.size}\``,
    type: "message",
  })
})
