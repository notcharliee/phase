import type { StoreManager } from "~/structures/managers/StoreManager"
import type { BotCommandBuilder } from "~/structures/builders/BotCommandBuilder"
import type { BotCronBuilder } from "~/structures/builders/BotCronBuilder"
import type { BotEventBuilder } from "~/structures/builders/BotEventBuilder"
import type { CommandFile } from "~/types/commands"
import type { BotConfig } from "~/types/config"
import type { CronFile } from "~/types/crons"
import type { BotEventName, EventFile } from "~/types/events"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPluginResolvable } from "~/types/plugin"
import type { BotPrestart } from "~/types/prestart"
import type { Stores } from "~/types/stores"

export interface PhaseClientParams {
  /**
   * Whether or not to run the bot in development mode.
   *
   * @remarks This will override the `NODE_ENV` environment variable.
   */
  dev?: boolean

  /**
   * The files to pass to the bot handlers.
   *
   * @remarks This is used for production builds to avoid loading the command files at runtime.
   */
  files?: {
    commands?: CommandFile[]
    crons?: CronFile[]
    events?: EventFile[]
    middleware?: BotMiddleware
    prestart?: BotPrestart
  }

  /**
   * What exports to use in bot files.
   */
  exports?: {
    commands?: "default" | ((exports: unknown) => BotCommandBuilder)
    crons?: "default" | ((exports: unknown) => BotCronBuilder)
    events?:
      | "default"
      | ((exports: unknown) => BotEventBuilder<BotEventName, undefined>)
    middleware?: "default" | ((exports: unknown) => BotMiddleware)
    prestart?: "default" | ((exports: unknown) => BotPrestart)
  }

  /**
   * The discord.js client options.
   */
  config?: BotConfig

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
