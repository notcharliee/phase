import { GatewayIntentBits, Partials, ActivityType } from "discord.js"
import { setConfig } from "phasebot"

/** @type {import("phasebot").ConfigOptions} */
export default setConfig({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
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
