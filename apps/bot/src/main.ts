import { Partials } from "discord.js"
import { PhaseClient } from "phasebot"

import { musicPlugin } from "~/lib/music"
import { storePlugin } from "~/lib/store"

const isDev = process.env.NODE_ENV === "development"

const phaseClient = new PhaseClient({
  config: {
    intents: [
      "DirectMessages",
      "Guilds",
      "GuildMembers",
      "GuildModeration",
      "GuildEmojisAndStickers",
      "GuildInvites",
      "GuildMessages",
      "GuildMessageReactions",
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
  plugins: [musicPlugin, storePlugin],
})

await phaseClient.start()
