import type { BotCommandBuilder, BotSubcommandBuilder } from "~/builders"

export interface BaseCommandFile {
  name: string
  path: string
  command: BotCommandBuilder
}

export interface SubCommandFile {
  name: string
  path: string
  parent: string
  group?: string
  command: BotSubcommandBuilder
}

export type CommandFile = BaseCommandFile | SubCommandFile
