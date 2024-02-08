import { alertDevs, clientEvent } from "#src/utils/index.js"
import { GuildSchema } from "@repo/schemas"


export default clientEvent ({
  name: "guildDelete",
  async execute(client, guild) {
    const guildSchema = await GuildSchema.findOne({ id: guild.id })
    if (!guildSchema) return

    await guildSchema.deleteOne()

    await alertDevs ({
      title: "Bot kicked from guild",
      description: `new guild count: \`${client.guilds.cache.size}\``,
      type: "message",
    })
  }
})
