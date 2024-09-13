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
