import * as Discord from 'discord.js'
import * as Utils from './index.js'
import { env } from '../index.js'


export async function alertDevs (data: { title: string, description?: string, type: 'message' | 'warning' | 'error' }) {

  if (typeof env.WEBHOOK_ALERT != 'string') throw new Error('Alert webhook connection URL not found.')

  const webhookClient = new Discord.WebhookClient({
    url: env.WEBHOOK_ALERT
  })

  let emoji: string = '⚠️ '
  if (data.type == 'message') emoji = Utils.Enums.PhaseEmoji.Announce
  else if (data.type == 'error') emoji = Utils.Enums.PhaseEmoji.Failure

  const webhookAlert = await webhookClient.send({
    embeds: [
      new Discord.EmbedBuilder()
        .setTitle(emoji + data.title)
        .setDescription(data.description ?? null)
        .setColor(data.type == 'message' ? Utils.Enums.PhaseColour.Primary : data.type == 'warning' ? Utils.Enums.PhaseColour.Warning : Utils.Enums.PhaseColour.Failure)
        .setTimestamp()
        .setFooter({ text: env.NODE_ENV == "development" ? 'Phase [Alpha]' : 'Phase [Production]' })
    ]
  })

  if (data.type == 'message' || 'warning') console.log(`[Alert] ${data.title}\n➤ https://discord.com/channels/1078130365421596733/${webhookAlert.channel_id}/${webhookAlert.id}`)
  else throw new Error(data.title && data.description ? `${data.title} \n${data.description}` : data.title)

}


/**
 * 
 * @param interaction An interaction or message to reply to. 
 * @param title The title of the error embed.
 * @param error The error string (common errors found in {@link Utils.Enums.PhaseError}).
 */
export function clientError <deffered = false> (
  interaction: Discord.Interaction,
  title: 'Well, this is awkward..' | 'No can do!' | 'Access Denied!',
  error: string,
  ephemeral?: boolean,
  deffered?: deffered,
) {

  const interactionReplyOptions: Discord.InteractionReplyOptions = {
    components: [
      new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .setComponents(
          new Discord.ButtonBuilder()
            .setLabel('Report Bug')
            .setStyle(Discord.ButtonStyle.Link)
            .setURL(Utils.Enums.PhaseURL.PhaseSupport)
        )
    ],
    embeds: [
      new Discord.EmbedBuilder()
        .setColor(Utils.Enums.PhaseColour.Failure)
        .setDescription(error)
        .setTitle(Utils.Enums.PhaseEmoji.Failure + title)
    ],
    ephemeral
  }

  const throwError = (error: any) => Utils.Functions.alertDevs({
    title: `\`clientError()\` Failure`,
    description: `${error}`,
    type: 'warning',
  })

  if (interaction.isChatInputCommand()) deffered
  ? interaction.editReply(interactionReplyOptions)
  : interaction.reply(interactionReplyOptions)
    .catch(() => { interaction.editReply(interactionReplyOptions) })
    .catch((error) => { throwError(error) })

  if (interaction.isButton()) deffered
  ? interaction.followUp(interactionReplyOptions)
  : interaction.reply(interactionReplyOptions)
    .catch(() => { interaction.editReply(interactionReplyOptions) })
    .catch((error) => { throwError(error) })

  if (interaction.isModalSubmit()) deffered
  ? interaction.editReply(interactionReplyOptions)
  : interaction.reply(interactionReplyOptions)
    .catch(() => { interaction.editReply(interactionReplyOptions) })
    .catch((error) => { throwError(error) })

}


/**
 * 
 * @param data The slash command data.
 * @param permissions The 
 * @param execute The code to execute when the event fires.
 * @returns Object containing the serialized SlashCommandBuilder and execute function.
 */
export function clientSlashCommand ({ data, permissions, execute }: {
  data: Utils.Types.SlashCommandData<true>,
  permissions?: Utils.Types.SlashCommandPermissions,
  execute: (
    client: Discord.Client<true>,
    interaction: Discord.ChatInputCommandInteraction
  ) => Promise<any>
}): Utils.Types.SlashCommand {

  return {
    data: data.toJSON(),
    permissions,
    execute,
  }

}


/**
 * 
 * @param name The custom id of the button.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the button custom id and execute function.
 */
export function clientButtonEvent ({ customId, execute }: {
  customId: string | RegExp,
  execute: (
    client: Discord.Client<true>,
    data: Discord.ButtonInteraction<Discord.CacheType>
  ) => Promise<any>
}): Utils.Types.EventFile<'interactionCreate'> {

  return clientEvent({
    name: 'interactionCreate',
    async execute(client, interaction) {

      if (!interaction.isButton()) return
      if ((customId instanceof RegExp && !customId.test(interaction.customId)) || (customId instanceof String && customId != interaction.customId)) return

      execute(client, interaction).catch((error) => {
        alertDevs({
          title: 'Button execution failed',
          description: `${error}`,
          type: 'error',
        })
      })

    },
  })

}


/**
 * 
 * @param customId The custom id of the modal.
 * @param fromMessage If the modal is coming from a message or not.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the modal custom id and execute function.
 */
export function clientModalEvent <T extends boolean> ({ customId, fromMessage, execute }: {
  customId: string | RegExp,
  fromMessage: T,
  execute: (
    client: Discord.Client<true>,
    interaction: T extends boolean ? Discord.ModalMessageModalSubmitInteraction<Discord.CacheType> : Discord.ModalSubmitInteraction<Discord.CacheType>
  ) => Promise<any>
}): Utils.Types.EventFile<'interactionCreate'> {

  return clientEvent({
    name: 'interactionCreate',
    async execute(client, interaction) {

      if (!interaction.isModalSubmit()) return
      if (fromMessage && !interaction.isFromMessage()) return
      if ((customId instanceof RegExp && !customId.test(interaction.customId)) || (customId instanceof String && customId != interaction.customId)) return

      execute(client, interaction as T extends boolean ? Discord.ModalMessageModalSubmitInteraction<Discord.CacheType> : Discord.ModalSubmitInteraction<Discord.CacheType>).catch((error) => {
        alertDevs({
          title: 'Modal execution failed',
          description: `${error}`,
          type: 'error',
        })
      })

    },
  })

}


/**
 * 
 * @param name The name of the event.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the event name and execute function.
 */
export function clientEvent <T extends keyof Discord.ClientEvents> ({ name, execute }: {
  name: T,
  execute: (
    client: Discord.Client<true>,
    ...data: Discord.ClientEvents[T]
  ) => Promise<any>
}): Utils.Types.EventFile<T> {

  return {
    name,
    execute,
  }

}


/**
 * 
 * @param name The name of the event.
 * @param interval The number of miliseconds between each interval.
 * @param execute The code to execute when the event fires.
 * @returns Object containing the event name and execute function.
 */
export function clientLoop ({ name, interval, execute }: {
  name: string,
  interval: number,
  execute: (
    client: Discord.Client<true>,
  ) => Promise<any>
}): Utils.Types.LoopFile {

  return {
    name,
    interval,
    execute,
  }

}


/**
 * 
 * @param permission The permission to you want the name of.
 * @returns The name of the permission.
 */
export function getPermissionName (permission: bigint): string {

  for (const perm of Object.keys(Discord.PermissionFlagsBits)) 
  if ((Discord.PermissionFlagsBits as any)[perm] == permission) return perm

  return 'UnknownPermission'

}


/**
 * 
 * @param array The array to use.
 * @param amount The number of elements.
 * @returns Array of random elements.
 */
export function getRandomArrayElements(array: any[], amount: number) {

  const shuffledArray = [...array]
  
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  return shuffledArray.slice(0, amount)

}


/**
 * 
 * @param date The date to format.
 * @returns Formatted date string.
 */
export function formatDate (date: Date) {
  return `${'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')[date.getUTCDay()]} ${'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',')[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${('0' + (date.getUTCHours() % 12 || 12)).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)} ${date.getUTCHours() >= 12 ? 'PM' : 'AM'}`
}


/**
 * 
 * @param number The number to format.
 * @returns Formatted number string.
 */
export function formatNumber (number: number) {
  if (number >= 1000000000) return (number / 1000000000).toFixed(1) + 'B'
  else if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
  else if (number >= 1000) return (number / 1000).toFixed(1) + 'K'
  else return number.toString()
}