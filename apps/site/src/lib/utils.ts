import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (input: string) => {
  const words = input.split(' ')

  if (!words.length) return "N/A"
  if (words.length == 1) return words[0]!.slice(0, 2).toUpperCase()

  return words[0]!.charAt(0).toUpperCase() + words[words.length - 1]!.charAt(0).toUpperCase()
}
