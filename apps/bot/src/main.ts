import { Options, Partials } from "discord.js"
import { BotClient } from "@phasejs/core/client"

import { musicPlugin } from "@plugin/music"
import { voicePlugin } from "@plugin/voice"
import { bridgeServerPlugin } from "@repo/bridge/server"

import { Emojis } from "~/lib/emojis"

import { ConfigStore } from "~/structures/stores/ConfigStore"
import { GuildStore } from "~/structures/stores/GuildStore"
import { InviteStore } from "~/structures/stores/InviteStore"
import { StreamerStore } from "~/structures/stores/StreamerStore"

const phaseClient = new BotClient({
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
    sweepers: {
      ...Options.DefaultSweeperSettings,
      messages: {
        interval: 60 * 60, // run every hour
        lifetime: 60 * 30, // only keep messages for 30 minutes
      },
    },
    makeCache: Options.cacheWithLimits({
      ...Options.DefaultMakeCacheSettings,
      ReactionManager: {
        maxSize: 0,
        keepOverLimit: (reaction) => {
          const reactionsToKeep = [Emojis.GiveawayReaction]
          return !!(
            reaction.me &&
            reaction.emoji.name &&
            reactionsToKeep.includes(reaction.emoji.name)
          )
        },
      },
    }),
  },
  plugins: [voicePlugin(), musicPlugin(), bridgeServerPlugin()],
  stores: {
    config: new ConfigStore(),
    guilds: new GuildStore(),
    invites: new InviteStore(),
    streamers: new StreamerStore(),
  },
})

await phaseClient.init()
