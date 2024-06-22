import { ActivityType, Partials } from "discord.js"
import { setConfig } from "phasebot"

/** @type {import("phasebot").ConfigOptions} */
export default setConfig({
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
  presence: {
    activities: [
      {
        name: "🔗 phasebot.xyz",
        type: ActivityType.Custom,
      },
    ],
    status: "online",
  },
})
