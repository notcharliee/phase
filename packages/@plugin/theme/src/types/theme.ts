import type { Theme } from "~/structures/Theme"
import type { ButtonStyle, GuildResolvable } from "discord.js"

/**
 * A UUID that uniquely identifies a theme.
 */
export type ThemeId = string & { __brand: "theme" }

/**
 * An image background for cards.
 */
export interface ThemeBackgroundImage {
  type: "image"
  url: string
  hash: string
  fallback: string
}

/**
 * A gradient background for cards.
 */
export interface ThemeBackgroundGradient {
  type: "gradient"
  colours: string[]
  direction: number
}

/**
 * A solid colour background for cards.
 */
export interface ThemeBackgroundSolid {
  type: "solid"
  colour: string
}

/**
 * A background for cards.
 */
export type ThemeBackground =
  | ThemeBackgroundImage
  | ThemeBackgroundGradient
  | ThemeBackgroundSolid

/**
 * A record of buttons styles for messages.
 */
export type ThemeButtons = Record<
  "primary" | "secondary" | "destructive",
  Omit<ButtonStyle, ButtonStyle.Link | ButtonStyle.Premium>
>

/**
 * A record of colours for cards and embeds.
 */
export interface ThemeColours {
  primary: string
  secondary: string
  accent: string
}

/**
 * A font name for cards.
 */
export type ThemeFont = string

export type ThemeResolvable = Theme | ThemeId | GuildResolvable
