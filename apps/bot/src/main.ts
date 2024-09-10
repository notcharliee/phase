import { Partials } from "discord.js"
import { PhaseClient } from "phasebot"

import { distubePlugin } from "~/lib/distube"

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
  plugins: [distubePlugin],
})

await phaseClient.start()
