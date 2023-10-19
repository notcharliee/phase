import * as Discord from 'discord.js'
import * as Utils from 'utils'


export default Utils.Functions.clientEvent({
  name: 'ready',
  async execute(client) {

    cacheMessages()
    
    async function cacheMessages() {
      const reactionRolesSchemas = await Utils.Schemas.ReactionRoles.find()
      
      for (const schema of reactionRolesSchemas) {

        const { guild, channel, message } = schema

        const fetchedChannel = client.channels.cache.get(`${channel}`)
        if (!fetchedChannel || !fetchedChannel.isTextBased()) return Utils.Schemas.ReactionRoles.deleteOne({ channel, guild, message })

        const fetchedMessage = await fetchedChannel.messages.fetch(`${message}`).catch(() => {return})
        if (!fetchedMessage) return Utils.Schemas.ReactionRoles.deleteOne({ channel, guild, message })

      }
    }
    
  }
})