import type { ClientOptions } from "discord.js"

export interface BotConfig extends ClientOptions {
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
