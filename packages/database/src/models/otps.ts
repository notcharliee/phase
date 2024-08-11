import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Otp {
  /** The one time password */
  otp: string
  /** The user's ID */
  userId: string
  /** The guild's ID */
  guildId: string
  /** The date the otp was created */
  createdAt: Date
}

export const otps = defineModel(
  "Otps",
  new mongoose.Schema<Otp>({
    otp: { type: String, required: true },
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    createdAt: { type: Date, expires: "1m", required: true, default: Date.now },
  }),
)
