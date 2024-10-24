import { PermissionFlagsBits, SnowflakeUtil } from "discord.js"

import unsafeMs from "ms"

import type { GuildBasedChannel, GuildTextBasedChannel } from "discord.js"

export function isSnowflake(id: string) {
  try {
    return SnowflakeUtil.deconstruct(id).timestamp > SnowflakeUtil.epoch
  } catch {
    return false
  }
}

export function isSendableChannel(
  channel: GuildBasedChannel,
): channel is GuildTextBasedChannel {
  const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
  ]

  return (
    channel.isSendable() &&
    channel.permissionsFor(channel.guild.members.me!).has(requiredPermissions)
  )
}

export function getDayName(day: number, short = false) {
  switch (day) {
    case 0:
      return short ? "Sun" : "Sunday"
    case 1:
      return short ? "Mon" : "Monday"
    case 2:
      return short ? "Tue" : "Tuesday"
    case 3:
      return short ? "Wed" : "Wednesday"
    case 4:
      return short ? "Thu" : "Thursday"
    case 5:
      return short ? "Fri" : "Friday"
    case 6:
      return short ? "Sat" : "Saturday"
  }
}

/**
 * Format duration to string
 * @param sec - Duration in seconds
 */
export function formatDuration(secs: number): string {
  if (!secs || !Number(secs)) return "00:00"

  const seconds = Math.floor(secs % 60)
  const minutes = Math.floor((secs % 3600) / 60)
  const hours = Math.floor(secs / 3600)

  const formatInt = (int: number) => (int < 10 ? `0${int}` : int)

  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`
  } else if (minutes > 0) {
    return `${formatInt(minutes)}:${formatInt(seconds)}`
  } else {
    return `00:${formatInt(seconds)}`
  }
}

/**
 * Exploits a long-lasting bug in Discord where the content of a message is hidden if it's preceded by a bunch of pipe characters. Useful for hiding metadata in messages.
 *
 * @param content The content to hide.
 * @throws If the message exceeds 997 characters due to Discord's message length limit.
 */
export function createHiddenContent(content: string) {
  const glitchedPipes =
    "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ "

  const maximumLength = 2000
  const messageLength = glitchedPipes.length + content.length

  if (messageLength > maximumLength) {
    throw new Error(
      `Message length exceeds maximum length of ${maximumLength} characters.`,
    )
  }

  return glitchedPipes + content
}

/**
 * Parses a message that was hidden using `createHiddenContent`.
 *
 * @param content The content to parse.
 * @throws If the message was not hidden using `createHiddenContent`.
 */
export function parseHiddenContent(content: string) {
  const glitchedPipes =
    "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ "

  if (!content.includes(glitchedPipes)) {
    return null
  }

  const hiddenContent = content.split(glitchedPipes)[1]!
  return hiddenContent
}

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to parse or format.
 * @returns The parsed or formatted value.
 */
export function safeMs<T extends string | number>(
  value: T,
  options?: T extends number ? { long: boolean } : never,
) {
  let parsedValue: string | number | undefined

  try {
    parsedValue =
      typeof value === "string" ? unsafeMs(value) : unsafeMs(value, options)
  } catch {
    parsedValue = undefined
  }

  return parsedValue as unknown as T extends string
    ? number | undefined
    : string | undefined
}

const dateToTimestampTypeMap = {
  shortTime: "t",
  longTime: "T",
  shortDate: "d",
  longDate: "D",
  shortDateTime: "f",
  longDateTime: "F",
  relative: "R",
}

export function dateToTimestamp(
  date: Date,
  type: keyof typeof dateToTimestampTypeMap = "relative",
) {
  const timestamp = Math.floor(date.getTime() / 1000)
  const typeChar = dateToTimestampTypeMap[type]
  return `<t:${timestamp}:${typeChar}>`
}

export function wrapText(text: string, wrapper: string) {
  return `${wrapper}${text}${wrapper}`
}

/**
 * Truncates a string to a specified length and appends an ellipsis (`...`) at the end,
 * replacing the last three characters if truncation is necessary.
 *
 * @param str The string to be truncated.
 * @param maxLength The maximum length of the truncated string, including the ellipsis.
 * @returns The truncated string with an ellipsis, or the original string if no truncation is needed.
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.slice(0, maxLength - 3) + "..."
}

/**
 *
 * @param number The number to format.
 * @returns Formatted number string.
 */
export function formatNumber(number: number) {
  if (number >= 1e9) return (number / 1e9).toFixed(1) + "B"
  else if (number >= 1e6) return (number / 1e6).toFixed(1) + "M"
  else if (number >= 1e3) return (number / 1e3).toFixed(1) + "K"
  else return number.toString()
}

export const getOrdinal = (number: number): string => {
  if (number >= 11 && number <= 13) return number + "th"
  return (
    number +
    (["th", "st", "nd", "rd"][number % 10] ?? ["th", "st", "nd", "rd"][0]!)
  )
}

/**
 *
 * @param date The date to format.
 * @returns Formatted date string.
 */
export function formatDate(date: Date) {
  const start = new Date(date)
  const end = new Date()
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    days += new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const parts = []
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`)
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`)
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`)

  return parts.join(", ")
}
