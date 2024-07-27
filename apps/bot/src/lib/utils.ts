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
    (["th", "st", "nd", "rd"][number % 10] || ["th", "st", "nd", "rd"][0]!)
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
