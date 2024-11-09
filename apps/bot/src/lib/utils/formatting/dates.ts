/**
 * Formats a date to a string.
 *
 * @param date The date to format.
 */
export function dateToString(date: Date) {
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

/**
 * Formats a date to a Discord timestamp.
 *
 * @param date The date to format.
 * @param type The type of timestamp to format.
 */
export function dateToTimestamp(
  date: Date,
  type: keyof typeof dateToTimestampTypeMap = "relative",
) {
  const timestamp = Math.floor(date.getTime() / 1000)
  const typeChar = dateToTimestampTypeMap[type]
  return `<t:${timestamp}:${typeChar}>`
}

export const dateToTimestampTypeMap = {
  shortTime: "t",
  longTime: "T",
  shortDate: "d",
  longDate: "D",
  shortDateTime: "f",
  longDateTime: "F",
  relative: "R",
}
