import { BotPlugin } from "@phasejs/core/client"

import { pluginVersion } from "~/lib/utils"

import { VoiceManager } from "~/structures/VoiceManager"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    voices: VoiceManager
  }
}

export function voicePlugin() {
  return new BotPlugin({
    name: "VoiceManager",
    version: pluginVersion,
    trigger: "init",
    onLoad: (phase) => {
      phase.client.voices = new VoiceManager(phase.client)
    },
  })
}

export * from "~/structures/Voice"
export * from "~/structures/VoiceManager"
