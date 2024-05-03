import { Client, ClientOptions, Collection } from "discord.js"

import {
  BotCommandBuilder,
  BotCommandMiddleware,
  BotCronBuilder,
  BotEventBuilder,
} from "~/builders"

export type CommandsCollection = Collection<string, BotCommandBuilder>
export type EventsCollection = Collection<string, ArrayUnion<BotEventBuilder>>
export type CronsCollection = Collection<string, ArrayUnion<BotCronBuilder>>

export class PhaseClient extends Client {
  constructor(options: ClientOptions) {
    super(options)
  }

  public commands: CommandsCollection = new Collection()
  public events: EventsCollection = new Collection()
  public crons: CronsCollection = new Collection()

  public middleware: BotCommandMiddleware | undefined
  public prestart: ((client: PhaseClient) => PromiseUnion<void>) | undefined
}
