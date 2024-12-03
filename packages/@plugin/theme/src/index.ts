import { BotPlugin } from "@phasejs/core/client"

import { pluginVersion } from "~/lib/utils"

import { ThemeManager } from "~/structures/ThemeManager"

import type { Theme } from "~/structures/Theme"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    themes: ThemeManager
  }
}

export function voicePlugin(themes: Theme[]) {
  return new BotPlugin({
    name: "ThemeManager",
    version: pluginVersion,
    trigger: "init",
    onLoad: (phase) => {
      phase.client.themes = new ThemeManager(phase.client, {
        themes,
        guilds: [],
      })
    },
  })
}

export * from "~/structures/Theme"
export * from "~/structures/ThemeManager"

export type * from "~/types/theme"
