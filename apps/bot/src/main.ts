import { Partials } from "discord.js"
import { PhaseClient } from "phasebot"

import { Music } from "~/structures/music/Music"
import { Store } from "~/structures/Store"
import { VoiceManager } from "~/structures/voice/VoiceManager"

declare module "discord.js" {
  interface Client {
    music: Music
    store: Store
    voices: VoiceManager
  }
}

const isDev = process.env.NODE_ENV === "development"

const phaseClient = new PhaseClient({
  config: {
    intents: [
      "Guilds",
      "GuildMembers",
      "GuildMessages",
      "GuildMessageReactions",
      "GuildModeration",
      "GuildInvites",
      "GuildVoiceStates",
    ],
    partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.Reaction,
      Partials.User,
    ],
  },
  dev: isDev,
  exports: {
    commands: "default",
    crons: "default",
    events: "default",
    middleware: "default",
    prestart: "default",
  },
  plugins: [VoiceManager.plugin, Music.plugin, Store.plugin],
})

await phaseClient.start()
