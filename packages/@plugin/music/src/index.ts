import { BotPluginBuilder } from "@phasejs/plugin"

import { pluginVersion } from "~/lib/utils"

import { Music } from "~/structures/Music"
import { Queue } from "~/structures/Queue"
import { QueueManager } from "~/structures/QueueManager"
import { Song } from "~/structures/Song"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    music: Music
  }
}

export function musicPlugin() {
  const musicPluginBuilder = new BotPluginBuilder()
    .setName("Music")
    .setVersion(pluginVersion)
    .setOnLoad((client) => {
      client.music = new Music(client)
    })

  return musicPluginBuilder.build()
}

export { Music, Queue, QueueManager, Song }
