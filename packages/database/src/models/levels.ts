import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Level {
  /** The guild's ID. */
  guild: string
  /** The user's ID. */
  user: string
  /** The user's level. */
  level: number
  /** The user's xp. */
  xp: number
}

export const Levels = defineModel(
  "Levels",
  new mongoose.Schema<Level>({
    guild: { type: String, required: true },
    user: { type: String, required: true },
    level: { type: Number, required: true },
    xp: { type: Number, required: true },
  }),
)
