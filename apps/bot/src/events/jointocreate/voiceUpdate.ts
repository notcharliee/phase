import { GuildSchema } from "@repo/schemas"
import { ChannelType } from "discord.js"
import { botEvent } from "phase.js"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    try {
      const guildSchema = await GuildSchema.findOne({ id: oldVoice.guild.id })
      const joinToCreateModule = guildSchema?.modules?.JoinToCreates
      if (!guildSchema || !joinToCreateModule?.enabled) return

      if (
        // If...
        oldVoice.channel && // User was in a channel before update AND...
        joinToCreateModule.active.includes(oldVoice.channel.id) && // The channel was a jtc channel AND...
        (!oldVoice.channel.members.size ||
          oldVoice.channel.members.every((member) => member.user.bot)) // There's no members left OR the only members left are bots...
      ) {
        // Delete old jtc channel and update database.
        oldVoice.channel.delete()

        joinToCreateModule.active.splice(
          joinToCreateModule.active.indexOf(oldVoice.channel.id),
          1,
        )

        guildSchema.markModified("modules")
        guildSchema.save()
      }

      if (
        // If...
        newVoice.channelId == joinToCreateModule.channel // New channel is the jtc base channel...
      ) {
        // Create new jtc channel, move member, and update database.
        const newVoiceChannel = await newVoice.guild.channels.create({
          name: newVoice.member?.displayName ?? "voice channel",
          type: ChannelType.GuildVoice,
          parent: joinToCreateModule.category,
        })

        newVoice.setChannel(newVoiceChannel)

        joinToCreateModule.active.push(newVoiceChannel.id)

        guildSchema.markModified("modules")
        guildSchema.save()
      }
    } catch (error) {
      throw error
    }
  },
)
