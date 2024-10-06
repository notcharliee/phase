import { joinVoiceChannel } from "@discordjs/voice"

import { Voice } from "~/structures/voice/Voice"

import type { Client, Snowflake, VoiceBasedChannel } from "discord.js"

/**
 * Manages voice connections and audio players.
 */
export class VoiceManager {
  public readonly client: Client
  public readonly voices: Map<Snowflake, Voice>

  constructor(client: Client) {
    this.client = client
    this.voices = new Map()

    client.on("voiceStateUpdate", (oldState, newState) => {
      const bot = oldState.guild.members.me!

      const botWasConnected = oldState.channel?.members.has(bot.id)
      const botIsStillConnected = newState.channel?.members.has(bot.id)

      if (!botWasConnected) return

      const botIsLonely = newState.channel?.members.size === 1

      if (botWasConnected && botIsStillConnected && botIsLonely) {
        void bot.voice.disconnect().catch((error: unknown) => {
          if (error instanceof Error) {
            console.error(`VoiceManager error: ${error.message}`)
            console.error(error)
            this.delete(oldState.guild.id)
          } else {
            throw error
          }
        })
      } else if (botWasConnected && !botIsStillConnected) {
        this.delete(oldState.guild.id)
      }
    })

    setInterval(() => this.cleanupIdleConnections(), 60 * 1000)
  }

  /**
   * Creates a new voice connection.
   */
  public create(channel: VoiceBasedChannel) {
    const { guild } = channel

    const existingVoiceExists = this.voices.has(guild.id)
    if (existingVoiceExists) this.voices.delete(guild.id)

    const connection = joinVoiceChannel({
      guildId: guild.id,
      channelId: channel.id,
      adapterCreator: guild.voiceAdapterCreator,
    })

    const voice = new Voice(this, { guild, channel, connection })

    this.voices.set(guild.id, voice)

    return voice
  }

  /**
   * Deletes a voice connection.
   */
  public delete(guildId: Snowflake) {
    this.voices.get(guildId)?.destroy()
  }

  /**
   * Cleans up idle voice connections. A voice connection is considered idle if
   * it has been silent (through any means) for 10 minutes.
   */
  private cleanupIdleConnections() {
    this.voices.forEach((voice) => {
      if (Date.now() - voice.lastSilentAt > 10 * 60 * 1000) {
        voice.destroy()
      }
    })
  }
}
