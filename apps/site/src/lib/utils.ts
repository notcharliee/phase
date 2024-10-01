import { clsx } from "clsx"
import unsafeMs from "ms"
import { twMerge } from "tailwind-merge"

import { env } from "./env"

import type { ClassValue } from "clsx"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const absoluteURL = (path: string) => env.NEXT_PUBLIC_BASE_URL + path

export const getInitials = (input: string) => {
  const words = input.split(" ")

  if (!words.length) return "N/A"
  if (words.length == 1) return words[0]!.slice(0, 2).toUpperCase()

  return (
    words[0]!.charAt(0).toUpperCase() +
    words[words.length - 1]!.charAt(0).toUpperCase()
  )
}

export const getOrdinal = (number: number): string => {
  if (number >= 11 && number <= 13) return number + "th"
  return (
    number +
    (["th", "st", "nd", "rd"][number % 10] ?? ["th", "st", "nd", "rd"][0]!)
  )
}

/** `Object.keys` but with better typing. */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

/** `Object.entries` but with better typing. */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function deleteKeyRecursively<TObj, TKey extends string>(
  obj: TObj,
  keyToDelete: TKey,
): Omit<TObj, TKey> {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  typeof obj === "object" &&
    obj !== null &&
    (Array.isArray(obj)
      ? obj.forEach((item) => deleteKeyRecursively(item, keyToDelete))
      : Object.entries(obj).forEach(([key, value]) =>
          key === keyToDelete
            ? delete obj[key as keyof typeof obj]
            : deleteKeyRecursively(value, keyToDelete),
        ))

  return obj as Omit<TObj, TKey>
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
