import { type ClientOptions } from "discord.js"

import chalk from "chalk"
import gradient from "gradient-string"
import { z } from "zod"

import { version as packageVersion } from "~/../package.json"

/** Configure how phasebot and discord.js will work in your project. */
export interface PhaseConfig extends ClientOptions {
  /** The shard's id to run, or an array of shard ids. If not specified, the client will spawn [shardCount](https://discord.js.org/docs/packages/discord.js/main/ClientOptions:Interface#shardCount) shards. If set to auto, it will fetch the recommended amount of shards from Discord and spawn that amount */
  shards?: ClientOptions["shards"]

  /** The total amount of shards used by all processes of this bot (e.g. recommended shard count, shard count of the ShardingManager) */
  shardCount?: ClientOptions["shardCount"]

  /** The amount of time in milliseconds to wait for the close frame to be received from the WebSocket. Don't have this too high/low. It's best to have it between 2000-6000 ms. */
  closeTimeout?: ClientOptions["closeTimeout"]

  /** Function to create a cache. You can use your own function, or the [Options](https://discord.js.org/docs/packages/discord.js/main/Options:Class) class to customize the Collection used for the cache. Overriding the cache used in `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager`, and `PermissionOverwriteManager` is unsupported and **will** break functionality */
  makeCache?: ClientOptions["makeCache"]

  /** Which mentions should be parsed from the message content (see [here](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more details) */
  allowedMentions?: ClientOptions["allowedMentions"]

  /** Structures allowed to be partial. This means events can be emitted even when they're missing all the data for a particular structure. See the "Partial Structures" topic on the [guide](https://discordjs.guide/popular-topics/partials.html) for some important usage information, as partials require you to put checks in place when handling data. */
  partials?: ClientOptions["partials"]

  /** Whether to error if the referenced message does not exist (creates a standard message in this case when false) */
  failIfNotExists?: ClientOptions["failIfNotExists"]

  /** Presence data to use upon login */
  presence?: ClientOptions["presence"]

  /** Intents to enable for this connection */
  intents: ClientOptions["intents"]

  /** Time in milliseconds that clients with the [GatewayIntentBits](https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits#Guilds) gateway intent should wait for missing guilds to be received before being ready. */
  waitGuildTimeout?: ClientOptions["waitGuildTimeout"]

  /** Options for cache sweeping */
  sweepers?: ClientOptions["sweepers"]

  /** Options for the WebSocket */
  ws?: ClientOptions["ws"]

  /** Options for the REST manager */
  rest?: ClientOptions["rest"]

  /** A function used to transform outgoing json data */
  jsonTransformer?: ClientOptions["jsonTransformer"]
}

export const phaseConfigSchema = z.object({
  shards: z
    .union([z.number(), z.array(z.number()), z.literal("auto")])
    .optional(),
  shardCount: z.number().optional(),
  closeTimeout: z.number().optional(),
  makeCache: z.function().optional(),
  allowedMentions: z
    .object({
      parse: z.array(z.enum(["roles", "users", "everyone"])),
      roles: z.array(z.string()),
      users: z.array(z.string()),
      repliedUser: z.boolean(),
    })
    .optional(),
  partials: z.array(z.number()).optional(),
  failIfNotExists: z.boolean().optional(),
  presence: z
    .object({
      status: z.enum(["idle", "online", "dnd", "invisible"]).optional(),
      afk: z.boolean().optional(),
      activities: z
        .array(
          z.object({
            name: z.string().optional(),
            state: z.string().optional(),
            url: z.string().optional(),
            type: z.number().min(0).max(5).optional(),
          }),
        )
        .optional(),
      shardId: z.union([z.number(), z.array(z.number())]).optional(),
    })
    .optional(),
  intents: z
    .array(
      z.union([
        z.enum([
          "Guilds",
          "GuildMembers",
          "GuildModeration",
          "GuildEmojisAndStickers",
          "GuildIntegrations",
          "GuildWebhooks",
          "GuildInvites",
          "GuildVoiceStates",
          "GuildPresences",
          "GuildMessages",
          "GuildMessageReactions",
          "GuildMessageTyping",
          "DirectMessages",
          "DirectMessageReactions",
          "DirectMessageTyping",
          "MessageContent",
          "GuildScheduledEvents",
          "AutoModerationConfiguration",
          "AutoModerationExecution",
        ]),
        z.number(),
      ]),
    )
    .optional(),
  waitGuildTimeout: z.number().optional(),
  sweepers: z.record(z.string(), z.any()).optional(), // not doing all that,
  ws: z
    .object({
      large_threshold: z.number().optional(),
      version: z.number().optional(),
      buildStrategy: z.function().optional(),
      buildIdentifyThrottler: z.function().optional(),
    })
    .optional(),
  rest: z.record(z.string(), z.any()).optional(), // also not doing all that
  jsonTransformer: z.function().optional(),
})

export const phaseGradient = gradient(["#DB00FF", "#8000FF"])

export const cliHeader = chalk.bold(
  phaseGradient(`☽ PhaseBot v${packageVersion}`),
)

export const getEnvironments = async () => {
  const envs = [".env", ".env.local"]
  if (Bun.env.NODE_ENV) envs.push(`.env.${Bun.env.NODE_ENV}`)

  for (let i = envs.length - 1; i >= 0; i--) {
    const file = envs[i]!
    if (!(await Bun.file(file).exists())) {
      envs.splice(i, 1)
    }
  }

  return envs
}

export const getConfig = async () => {
  const configPath = Array.from(
    new Bun.Glob("phase.config.{ts,js,cjs,mjs}").scanSync({
      absolute: true,
    }),
  )[0]

  if (!configPath) {
    throw new Error(
      "Config file not found. Please make a 'phase.config.{ts,js,cjs,mjs}' file.",
    )
  }

  const defaultExport = await import(configPath).then((m) => m.default)
  const config = phaseConfigSchema.parse(defaultExport)

  return {
    ...(config as PhaseConfig),
    configPath,
  }
}
