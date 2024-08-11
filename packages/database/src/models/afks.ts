import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface AFK {
  /** The user's ID. */
  user: string
  /** The user's reason for being AFK. */
  reason?: string
}

export const afks = defineModel(
  "AFKs",
  new mongoose.Schema<AFK>({
    user: { type: String, required: true },
    reason: { type: String },
  }),
  {
    user: { unique: true },
  },
)
