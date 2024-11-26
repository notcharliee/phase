import { BotPlugin } from "@phasejs/core/client"

import { pluginVersion } from "~/lib/utils"

import { Music } from "~/structures/Music"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    music: Music
  }
}

export function musicPlugin() {
  return new BotPlugin({
    name: "Music",
    version: pluginVersion,
    trigger: "init",
    onLoad: (phase) => {
      phase.client.music = new Music(phase.client)
    },
  })
}

export * from "~/structures/Music"
export * from "~/structures/Queue"
export * from "~/structures/QueueManager"
export * from "~/structures/Song"
