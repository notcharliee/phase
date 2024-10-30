import type { BotCommandBuilder } from "~/structures/builders/BotCommandBuilder"
import type { BotCronBuilder } from "~/structures/builders/BotCronBuilder"
import type { BotEventBuilder } from "~/structures/builders/BotEventBuilder"
import type { BotCommandFile } from "~/types/commands"
import type { BotCronFile } from "~/types/crons"
import type { BotEventFile } from "~/types/events"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPluginResolvable } from "~/types/plugin"
import type { BotPrestart } from "~/types/prestart"
import type { Stores } from "~/types/stores"
import type { ClientOptions } from "discord.js"

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
   * What exports to use in bot files.
   *
   * @deprecated
   */
  exports?: {
    commands?: "default" | ((exports: unknown) => BotCommandBuilder)
    crons?: "default" | ((exports: unknown) => BotCronBuilder)
    events?: "default" | ((exports: unknown) => BotEventBuilder)
    middleware?: "default" | ((exports: unknown) => BotMiddleware)
    prestart?: "default" | ((exports: unknown) => BotPrestart)
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
  plugins?: BotPluginResolvable[]

  /**
   * The stores to create.
   *
   * @remarks Stores are created in the order they are specified.
   */
  stores?: Stores
}
