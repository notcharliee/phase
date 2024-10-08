import { BotEventBuilder } from "~/structures/builders/BotEventBuilder"

import type {
  CacheType,
  Client,
  ClientEvents,
  Interaction,
} from "discord.js"

export interface EventFile {
  path: string
  event: BotEventBuilder<BotEventName, undefined>
}

export type BotEventName = keyof ClientEvents

export type BotEventInteractionContextMap = {
  Guild: Interaction<"raw" | "cached">
  BotDM: Interaction<undefined>
  PrivateChannel: Interaction<undefined>
}

export type BotEventContext = Record<
  Exclude<BotEventName, "interactionCreate">,
  never
> & {
  interactionCreate: keyof BotEventInteractionContextMap
}

export type BotEventArgs<
  TName extends BotEventName,
  TContext extends BotEventContext[TName] | undefined,
> = TName extends "interactionCreate"
  ? [
      interaction: TContext extends BotEventContext["interactionCreate"]
        ? BotEventInteractionContextMap[TContext]
        : Interaction<CacheType>,
    ]
  : ClientEvents[TName]

export type BotEventExecute<
  TName extends BotEventName = BotEventName,
  TContext extends BotEventContext[TName] | undefined = undefined,
> = (client: Client, ...args: BotEventArgs<TName, TContext>) => unknown
