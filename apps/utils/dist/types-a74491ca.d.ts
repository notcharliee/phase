import * as Discord from 'discord.js';

type SlashCommand = {
    data: SlashCommandData;
    permissions: SlashCommandPermissions;
    execute: SlashCommandExecute;
};
/**
 * @argument {Serialized} boolean Whether or not the data is serialized or not.
 */
type SlashCommandData<Serialized = false> = Serialized extends true ? Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Discord.SlashCommandSubcommandsOnlyBuilder : Discord.RESTPostAPIChatInputApplicationCommandsJSONBody;
type SlashCommandPermissions = {
    baseCommand: bigint | null;
    subCommands?: Record<string, bigint>;
} | undefined;
type SlashCommandExecute = (client: Discord.Client<true>, interaction: Discord.ChatInputCommandInteraction) => Promise<any>;
type EventFile<T extends keyof Discord.ClientEvents> = {
    name: T;
    execute: (client: Discord.Client<boolean>, ...data: Discord.ClientEvents[T]) => Promise<any>;
};
type LoopFile = {
    name: string;
    interval: number;
    execute: (client: Discord.Client<boolean>) => Promise<any>;
};

type types_EventFile<T extends keyof Discord.ClientEvents> = EventFile<T>;
type types_LoopFile = LoopFile;
type types_SlashCommand = SlashCommand;
type types_SlashCommandData<Serialized = false> = SlashCommandData<Serialized>;
type types_SlashCommandExecute = SlashCommandExecute;
type types_SlashCommandPermissions = SlashCommandPermissions;
declare namespace types {
  export {
    types_EventFile as EventFile,
    types_LoopFile as LoopFile,
    types_SlashCommand as SlashCommand,
    types_SlashCommandData as SlashCommandData,
    types_SlashCommandExecute as SlashCommandExecute,
    types_SlashCommandPermissions as SlashCommandPermissions,
  };
}

export { EventFile as E, LoopFile as L, SlashCommandData as S, SlashCommandPermissions as a, SlashCommand as b, SlashCommandExecute as c, types as t };
