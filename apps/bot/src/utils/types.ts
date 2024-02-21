import * as Discord from 'discord.js'


export type SlashCommand = {
  data: SlashCommandData,
  permissions: SlashCommandPermissions,
  execute: SlashCommandExecute,
}


/**
 * @argument {Serialized} boolean Whether or not the data is serialized or not. 
 */
export type SlashCommandData<Serialized = false> = Serialized extends true
? Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Discord.SlashCommandSubcommandsOnlyBuilder
: Discord.RESTPostAPIChatInputApplicationCommandsJSONBody


export type SlashCommandPermissions = {
  baseCommand: bigint | null,
  subCommands?: Record<string, bigint>,
} | undefined


export type SlashCommandExecute = (
  client: Discord.Client<true>,
  interaction: Discord.ChatInputCommandInteraction
) => Promise<any>


export type EventFile<T extends keyof Discord.ClientEvents> = {
  name: T,
  execute: (
    client: Discord.Client<true>,
    ...data: Discord.ClientEvents[T]
  ) => Promise<any>,
}


export type LoopFile = {
  name: string,
  interval: number,
  execute: (
    client: Discord.Client<true>,
  ) => Promise<any>,
}