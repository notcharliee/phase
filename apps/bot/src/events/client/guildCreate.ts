import { alertDevs, clientEvent } from "#src/utils/index.js"
import { GuildSchema } from "@repo/schemas"


export default clientEvent ({
  name: "guildCreate",
  async execute(client, guild) {
    const guildSchema = await GuildSchema.findOne({ id: guild.id })
    if (guildSchema) return

    await new GuildSchema ({
      id: guild.id,
      admins: [guild.ownerId],
      commands: {},
      modules: {
        AuditLogs: { enabled: false },
        AutoPartners: { enabled: false },
        AutoRoles: { enabled: false },
        JoinToCreates: { enabled: false },
        Levels: { enabled: false },
        ReactionRoles: { enabled: false },
        Tickets: { enabled: false },
      },
      news_channel: null,
    }).save()

    await alertDevs ({
      title: "New guild",
      description: `name: \`${guild.name}\`\nid: \`${guild.id}\`\nmembers: \`${guild.memberCount}\`\n\nnew guild count: \`${client.guilds.cache.size}\``,
      type: "message",
    })
  }
})
