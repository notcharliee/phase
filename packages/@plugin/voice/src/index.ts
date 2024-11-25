import { BotPluginBuilder } from "@phasejs/plugin"

import { pluginVersion } from "~/lib/utils"

import { VoiceManager } from "~/structures/VoiceManager"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    voices: VoiceManager
  }
}

export function voicePlugin() {
  const voicePluginBuilder = new BotPluginBuilder()
    .setName("VoiceManager")
    .setVersion(pluginVersion)
    .setOnLoad((client) => {
      client.voices = new VoiceManager(client)
    })

  return voicePluginBuilder.build()
}
