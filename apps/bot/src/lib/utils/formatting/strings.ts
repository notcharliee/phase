/**
 * Truncates a string to a specified length and appends an ellipsis (`...`) at
 * the end, replacing the last three characters if truncation is necessary.
 *
 * @param str The string to be truncated.
 * @param maxLength The maximum length of the string.
 */
export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + "..."
}

/**
 * Wraps a string in a specified wrapper.
 *
 * @param text The string to be wrapped.
 * @param wrapper The wrapper to use.
 */
export function wrapText(text: string, wrapper: string) {
  return `${wrapper}${text}${wrapper}`
}
