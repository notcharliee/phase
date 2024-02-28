import { GuildSchema } from "@repo/schemas"
import { botEvent } from "phase.js"

export default botEvent("ready", async (client) => {
  const guildSchemas = await GuildSchema.find()

  for (const guildSchema of guildSchemas) {
    const reactionRolesModule = guildSchema.modules.ReactionRoles
    if (!reactionRolesModule?.enabled) continue

    const channel = client.channels.cache.get(`${reactionRolesModule.channel}`)
    if (!channel || !channel.isTextBased()) continue

    const fetchedMessage = await channel.messages.fetch(
      reactionRolesModule.message,
    )
    if (!fetchedMessage) continue
  }
})
