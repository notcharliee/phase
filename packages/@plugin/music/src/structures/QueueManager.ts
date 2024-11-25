import { BaseManager } from "discord.js"

import { Queue } from "~/structures/Queue"

import type { Music } from "~/structures/Music"
import type { Snowflake, VoiceBasedChannel } from "discord.js"

export class QueueManager extends BaseManager {
  public music: Music

  private queues: Map<Snowflake, Queue>

  constructor(music: Music) {
    super(music.client)

    this.music = music
    this.queues = new Map()

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      const bot = oldState.guild.members.me!

      const botWasConnected = oldState.channel?.members.has(bot.id)
      const botIsStillConnected = newState.channel?.members.has(bot.id)

      if (botWasConnected && !botIsStillConnected) {
        this.delete(oldState.guild.id)
      }
    })
  }

  public get(key: Snowflake) {
    return this.queues.get(key)
  }

  public set(key: Snowflake, value: Queue) {
    return this.queues.set(key, value)
  }

  public delete(key: Snowflake) {
    return this.queues.delete(key)
  }

  public has(key: Snowflake) {
    return this.queues.has(key)
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
