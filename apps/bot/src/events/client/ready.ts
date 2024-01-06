import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientEvent({
  name: 'ready',
  async execute(client) {
    const guildSchemas = await Schemas.GuildSchema.find()
    
    // Cache reaction roles messages
    for (const guildSchema of guildSchemas) {
      const reactionRolesModule = guildSchema.modules.ReactionRoles
      if (!reactionRolesModule.enabled) continue

      const channel = client.channels.cache.get(`${reactionRolesModule.channel}`)
      if (!channel || !channel.isTextBased()) continue

      const fetchedMessage = await channel.messages.fetch(reactionRolesModule.message)
      if (!fetchedMessage) continue
    }
  }
})