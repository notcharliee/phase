import { VoiceBasedChannel } from "discord.js"

import { BaseManager } from "~/managers/base"
import { Music } from "~/structures/music"
import { Queue } from "~/structures/queue"

import type { Snowflake } from "discord.js"

export class QueueManager extends BaseManager<Snowflake, Queue> {
  public music: Music

  constructor(music: Music) {
    super()
    this.music = music
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
