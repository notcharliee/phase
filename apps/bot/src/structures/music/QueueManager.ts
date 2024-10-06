import { BaseManager } from "~/structures/BaseManager"
import { Queue } from "~/structures/music/Queue"

import type { Music } from "~/structures/music/Music"
import type { Snowflake, VoiceBasedChannel } from "discord.js"

export class QueueManager extends BaseManager<Snowflake, Queue> {
  public music: Music

  constructor(music: Music) {
    super(music.client)
    this.music = music

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      const bot = oldState.guild.members.me!

      const botWasConnected = oldState.channel?.members.has(bot.id)
      const botIsStillConnected = newState.channel?.members.has(bot.id)

      if (botWasConnected && !botIsStillConnected) {
        this.delete(oldState.guild.id)
      }
    })
  }

  public create(voiceChannel: VoiceBasedChannel) {
    if (this.has(voiceChannel.guild.id)) {
      throw new Error("Queue already exists")
    }

    const newQueue = new Queue(this.music, voiceChannel)

    this.set(voiceChannel.guild.id, newQueue)

    return newQueue
  }
}
