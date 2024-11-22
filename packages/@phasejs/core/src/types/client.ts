import type { StoreManager } from "~/managers/StoreManager"
import type { BotCommandFile } from "~/types/commands"
import type { BotCronFile } from "~/types/crons"
import type { BotEventFile } from "~/types/events"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPlugin } from "~/types/plugin"
import type { BotPrestart } from "~/types/prestart"
import type { Stores } from "~/types/stores"
import type { Client, ClientOptions } from "discord.js"

declare module "discord.js" {
  interface Client {
    stores: StoreManager
  }
}

export type DjsClient<T extends boolean = boolean> = Client<T>

export interface PhaseClientParams {
  /**
   * Whether or not to run the bot in development mode.
   *
   * @remarks This will override the `NODE_ENV` environment variable.
   *
   * @deprecated
   */
  dev?: boolean

  /**
   * The files to pass to the bot handlers.
   *
   * @remarks This is used for production builds to avoid loading the command files at runtime.
   *
   * @deprecated
   */
  files?: {
    commands?: BotCommandFile[]
    crons?: BotCronFile[]
    events?: BotEventFile[]
    middleware?: BotMiddleware
    prestart?: BotPrestart
  }

  /**
   * The discord.js client options.
   */
  config: ClientOptions

  /**
   * The plugins to load.
   *
   * @remarks Plugins are loaded in the order they are specified.
   */
  plugins?: BotPlugin[]

  /**
   * The stores to create.
   *
   * @remarks Stores are created in the order they are specified.
   */
  stores?: Stores
}
