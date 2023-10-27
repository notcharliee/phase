import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientEvent({
  name: 'ready',
  async execute(client) {

    cacheMessages()
    
    async function cacheMessages() {
      const reactionRolesSchemas = await Schemas.ReactionRoles.find()
      
      for (const schema of reactionRolesSchemas) {

        const { guild, channel, message } = schema

        const fetchedChannel = client.channels.cache.get(`${channel}`)
        if (!fetchedChannel || !fetchedChannel.isTextBased()) return Schemas.ReactionRoles.deleteOne({ channel, guild, message })

        const fetchedMessage = await fetchedChannel.messages.fetch(`${message}`).catch(() => {return})
        if (!fetchedMessage) return Schemas.ReactionRoles.deleteOne({ channel, guild, message })

      }
    }
    
  }
})