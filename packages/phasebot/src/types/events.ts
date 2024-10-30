import type { CacheType, Client, ClientEvents, Interaction } from "discord.js"
import type { BotEvent } from "~/structures"

export type BotEventInteractionContextMap = {
  Guild: Interaction<"raw" | "cached">
  BotDM: Interaction<undefined>
  PrivateChannel: Interaction<undefined>
}

export type BotEventContextMap = Record<
  Exclude<BotEventName, "interactionCreate">,
  never
> & {
  interactionCreate: keyof BotEventInteractionContextMap
}

export type BotEventExecuteArgs<
  TName extends BotEventName,
  TContext extends BotEventContextMap[TName] | undefined,
> = TName extends "interactionCreate"
  ? [
      interaction: TContext extends BotEventContextMap["interactionCreate"]
        ? BotEventInteractionContextMap[TContext]
        : Interaction<CacheType>,
    ]
  : ClientEvents[TName]

export type BotEventName = keyof ClientEvents
export type BotEventContext = BotEventContextMap[BotEventName]
export type BotEventListenerType = "on" | "once"
export type BotEventMetadata = { type: "event"; [key: string]: unknown }
export type BotEventExecute<
  TName extends BotEventName = BotEventName,
  TContext extends BotEventContextMap[TName] = BotEventContextMap[TName],
> = (client: Client, ...args: BotEventExecuteArgs<TName, TContext>) => unknown

export interface BotEventFile {
  path: string
  event: BotEvent
}
