import * as Discord from 'discord.js';
import { S as SlashCommandData, a as SlashCommandPermissions, b as SlashCommand, E as EventFile, L as LoopFile } from './types-a74491ca.js';

declare function alertDevs(data: {
    title: string;
    description?: string;
    type: 'message' | 'warning' | 'error';
}): Promise<void>;
/**
 *
 * @param interaction An interaction or message to reply to.
 * @param title The title of the error embed.
 * @param error The error string (common errors found in {@link Utils.Enums.PhaseError}).
 */
declare function clientError<deffered = false>(interaction: Discord.Interaction, title: 'Well, this is awkward..' | 'No can do!' | 'Access Denied!', error: string, ephemeral?: boolean, deffered?: deffered): void;
/**
 *
 * @param data The slash command data.
 * @param permissions The
 * @param execute The code to execute when the event fires.
 * @returns Object containing the serialized SlashCommandBuilder and execute function.
 */
declare function clientSlashCommand({ data, permissions, execute }: {
    data: SlashCommandData<true>;
    permissions?: SlashCommandPermissions;
    execute: (client: Discord.Client<true>, interaction: Discord.ChatInputCommandInteraction) => Promise<any>;
}): SlashCommand;
/**
 *
 * @param name The custom id of the button.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the button custom id and execute function.
 */
declare function clientButtonEvent({ customId, execute }: {
    customId: string | RegExp;
    execute: (client: Discord.Client<true>, data: Discord.ButtonInteraction<Discord.CacheType>) => Promise<any>;
}): EventFile<'interactionCreate'>;
/**
 *
 * @param customId The custom id of the modal.
 * @param fromMessage If the modal is coming from a message or not.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the modal custom id and execute function.
 */
declare function clientModalEvent<T extends boolean>({ customId, fromMessage, execute }: {
    customId: string | RegExp;
    fromMessage: T;
    execute: (client: Discord.Client<true>, interaction: T extends boolean ? Discord.ModalMessageModalSubmitInteraction<Discord.CacheType> : Discord.ModalSubmitInteraction<Discord.CacheType>) => Promise<any>;
}): EventFile<'interactionCreate'>;
/**
 *
 * @param name The name of the event.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the event name and execute function.
 */
declare function clientEvent<T extends keyof Discord.ClientEvents>({ name, execute }: {
    name: T;
    execute: (client: Discord.Client<true>, ...data: Discord.ClientEvents[T]) => Promise<any>;
}): EventFile<T>;
/**
 *
 * @param name The name of the event.
 * @param interval The number of miliseconds between each interval.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the event name and execute function.
 */
declare function clientLoop({ name, interval, execute }: {
    name: string;
    interval: number;
    execute: (client: Discord.Client<true>) => Promise<any>;
}): LoopFile;
/**
 *
 * @param permission The permission to you want the name of.
 * @returns The name of the permission.
 */
declare function getPermissionName(permission: bigint): string;
/**
 *
 * @param array The array to use.
 * @param amount The number of elements.
 * @returns Array of random elements.
 */
declare function getRandomArrayElements(array: any[], amount: number): any[];
/**
 *
 * @param date The date to format.
 * @returns Formatted date string.
 */
declare function formatDate(date: Date): string;
/**
 *
 * @param number The number to format.
 * @returns Formatted number string.
 */
declare function formatNumber(number: number): string;

declare const functions_alertDevs: typeof alertDevs;
declare const functions_clientButtonEvent: typeof clientButtonEvent;
declare const functions_clientError: typeof clientError;
declare const functions_clientEvent: typeof clientEvent;
declare const functions_clientLoop: typeof clientLoop;
declare const functions_clientModalEvent: typeof clientModalEvent;
declare const functions_clientSlashCommand: typeof clientSlashCommand;
declare const functions_formatDate: typeof formatDate;
declare const functions_formatNumber: typeof formatNumber;
declare const functions_getPermissionName: typeof getPermissionName;
declare const functions_getRandomArrayElements: typeof getRandomArrayElements;
declare namespace functions {
  export {
    functions_alertDevs as alertDevs,
    functions_clientButtonEvent as clientButtonEvent,
    functions_clientError as clientError,
    functions_clientEvent as clientEvent,
    functions_clientLoop as clientLoop,
    functions_clientModalEvent as clientModalEvent,
    functions_clientSlashCommand as clientSlashCommand,
    functions_formatDate as formatDate,
    functions_formatNumber as formatNumber,
    functions_getPermissionName as getPermissionName,
    functions_getRandomArrayElements as getRandomArrayElements,
  };
}

export { alertDevs as a, clientSlashCommand as b, clientError as c, clientButtonEvent as d, clientModalEvent as e, functions as f, clientEvent as g, clientLoop as h, getPermissionName as i, getRandomArrayElements as j, formatDate as k, formatNumber as l };
