import { PhaseColour, PhaseURL } from "~/utils"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  PermissionFlagsBits,
  WebhookClient,
} from "discord.js"

import { env } from "~/env"

export async function alertDevs(data: {
  title: string
  description?: string
  type: "message" | "warning" | "error"
}) {
  if (typeof env.WEBHOOK_ALERT != "string")
    throw new Error("Alert webhook connection URL not found.")

  const webhookClient = new WebhookClient({
    url: env.WEBHOOK_ALERT,
  })

  const webhookAlert = await webhookClient.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(data.title)
        .setDescription(data.description ?? null)
        .setColor(
          data.type == "message"
            ? PhaseColour.Primary
            : data.type == "warning"
              ? PhaseColour.Warning
              : PhaseColour.Failure,
        )
        .setTimestamp()
        .setFooter({
          text:
            env.NODE_ENV == "development"
              ? "Phase [Alpha]"
              : "Phase [Production]",
        }),
    ],
  })

  if (data.type === "message" || data.type === "warning")
    console.log(
      `[Alert] ${data.title}\n➤ https://discord.com/channels/1078130365421596733/${webhookAlert.channel_id}/${webhookAlert.id}`,
    )
  else
    throw new Error(
      data.title && data.description
        ? `${data.title} \n${data.description}`
        : data.title,
    )
}

export const errorMessage = ({
  title,
  description,
  ephemeral,
}: {
  title: string
  description: string
  ephemeral?: boolean
}) => ({
  components: [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setLabel("Report a Bug")
        .setStyle(ButtonStyle.Link)
        .setURL(PhaseURL.PhaseSupport),
    ),
  ],
  embeds: [
    new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor("Red"),
  ],
  ephemeral,
})

export const memberNotFound = (ephemeral?: boolean): InteractionReplyOptions =>
  errorMessage({
    title: "Member Not Found",
    description:
      "Member not found. Make sure they are in this server, then try again.",
    ephemeral,
  })

export const missingPermission = (
  permission: string | bigint,
): InteractionReplyOptions =>
  errorMessage({
    title: "Missing Permission",
    description: `You are missing the \`${typeof permission === "bigint" ? getPermissionName(permission) : permission}\` permission, which is required to perform this action.`,
    ephemeral: true,
  })

/**
 *
 * @param array The array to use.
 * @param amount The number of elements.
 * @returns Array of random elements.
 */
export function getRandomArrayElements(array: any[], amount: number) {
  const shuffledArray = [...array]

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  return shuffledArray.slice(0, amount)
}

/**
 *
 * @param permission The permission to you want the name of.
 * @returns The name of the permission.
 */
export function getPermissionName(permission: bigint): string {
  for (const perm of Object.keys(PermissionFlagsBits))
    if ((PermissionFlagsBits as any)[perm] == permission) return perm

  return "UnknownPermission"
}
