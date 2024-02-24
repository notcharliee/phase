import { GatewayIntentBits, Partials, ActivityType } from "discord.js"
import { setConfig } from "../dist/index.js"

/** @type {import("../dist/index").ConfigOptions} */
export default setConfig({
  clientOptions: {
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
          name: "🎀 meow",
          type: ActivityType.Custom,
        },
      ],
      status: "online",
    },
  }
})
