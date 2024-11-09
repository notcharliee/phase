type AbbreviatedNumber = `${number}${"B" | "M" | "K" | ""}`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WithOrdinal<T extends number> = `${T}` extends `${infer U}${"1"}`
  ? `${T}st` // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : `${T}` extends `${infer U}${"2"}`
    ? `${T}nd` // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : `${T}` extends `${infer U}${"3"}`
      ? `${T}rd`
      : `${T}th`

type Duration = `${number}:${number}` | `${number}:${number}:${number}`

/**
 * Adds an abbreviation suffix to a number.
 *
 * @param number The number to format.
 */
export function numberToAbbrevition(number: number): AbbreviatedNumber {
  if (number >= 1e9) return `${+(number / 1e9).toFixed(1)}B`
  else if (number >= 1e6) return `${+(number / 1e6).toFixed(1)}M`
  else if (number >= 1e3) return `${+(number / 1e3).toFixed(1)}K`
  else return `${number}`
}

/**
 * Adds an ordinal suffix to a number.
 *
 * @param number The number to format.
 */
export function numberToOrdinal<T extends number>(number: T): WithOrdinal<T> {
  const ordinals = ["th", "st", "nd", "rd"] as const
  if (number >= 11 && number <= 13) return `${number}th` as WithOrdinal<T>
  return `${number}${ordinals[number % 10] ?? ordinals[0]}` as WithOrdinal<T>
}

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
