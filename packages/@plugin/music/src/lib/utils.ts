import { version as pkgVersion } from "~/../package.json"

export const pluginVersion = pkgVersion as `${number}.${number}.${number}`

type Duration = `${number}:${number}` | `${number}:${number}:${number}`

/**
 * Formats a number to a duration string.
 *
 * @param number - Duration in seconds.
 */
export function numberToDuration(number: number): Duration {
  if (!number || !Number(number)) return "00:00"

  const seconds = Math.floor(number % 60)
  const minutes = Math.floor((number % 3600) / 60)
  const hours = Math.floor(number / 3600)

  const formatInt = (int: number) => (int < 10 ? `0${int}` : int.toString())

  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}` as Duration
  } else if (minutes > 0) {
    return `${formatInt(minutes)}:${formatInt(seconds)}` as Duration
  } else {
    return `00:${formatInt(seconds)}` as Duration
  }
}
