import { BotEventBuilder } from "phasebot/builders"

export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (client, oldState, newState) => {
    if (oldState.channelId === newState.channelId) return

    const member = newState.member

    if (member?.id !== client.user?.id) return
    if (oldState.channelId && !newState.channelId) {
      const oldChannel = oldState.channel
      if (oldChannel) {
        const messages = await oldChannel.messages.fetch({ limit: 100 })
        const botMessages = messages.filter(
          (msg) => msg.author.id === client.user?.id,
        )
        const embedWithImage = botMessages.find(
          (msg) => msg.embeds.length > 0 && msg.embeds[0]?.image?.url,
        )

        if (embedWithImage) {
          await embedWithImage.delete()
        }
      }
    }
  })
