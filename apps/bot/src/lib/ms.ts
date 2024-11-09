import { default as unsafeMs } from "ms"

/**
 * The options to format with.
 */
export type MsOptions = { long: boolean }

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to parse.
 */
export function safeMs(value: string): number | undefined

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to format.
 * @param options The options to format with.
 */
export function safeMs(value: number, options?: MsOptions): string | undefined

export function safeMs(value: string | number, options?: MsOptions) {
  let parsedValue: number | string | undefined

  try {
    if (typeof value === "string") {
      parsedValue = unsafeMs(value)
    } else {
      parsedValue = unsafeMs(value, options)
    }
  } catch {
    parsedValue = undefined
  }

  return parsedValue
}
