import { BotPluginBuilder } from "@phasejs/plugin"

import { pluginVersion } from "~/lib/utils"

import { Music } from "~/structures/Music"

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

export * from "~/structures/Music"
export * from "~/structures/Queue"
export * from "~/structures/QueueManager"
export * from "~/structures/Song"
