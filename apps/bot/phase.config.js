import { GatewayIntentBits, Partials, ActivityType } from "discord.js"
import { setConfig } from "phase.js"

/** @type {import("phase.js").ConfigOptions} */
export default setConfig({
  intents: [
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
