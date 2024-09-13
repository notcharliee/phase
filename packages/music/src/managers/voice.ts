import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"

import { BaseManager } from "~/managers/base"
import { Voice } from "~/structures/voice"

import type { Snowflake, VoiceBasedChannel } from "discord.js"

export class VoiceManager extends BaseManager<Snowflake, Voice> {
  public create(voiceChannel: VoiceBasedChannel) {
    const existingVoice = this.get(voiceChannel.guild.id)

    if (existingVoice) {
      existingVoice.voiceChannel = voiceChannel
      return existingVoice
    }

    if (getVoiceConnection(voiceChannel.guild.id)) {
      throw new Error(
        "Voice connection exists but was not found in the manager",
      )
    }

    return new Voice(this, voiceChannel)
  }

  public async join(voiceChannel: VoiceBasedChannel) {
    const voice = this.get(voiceChannel.guild.id)
    if (voice) return await voice.join(voiceChannel)
    return await this.create(voiceChannel).join()
  }

  public leave(guildId: Snowflake) {
    const voice = this.get(guildId)

    if (voice) {
      voice.leave()
    } else {
      const voiceConnection = getVoiceConnection(guildId)

      if (
        voiceConnection &&
        voiceConnection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        voiceConnection.destroy()
      }
    }
  }
}
