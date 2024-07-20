import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Otp {
  /** The date the otp was created */
  createdAt: Date
  /** The user's ID */
  userId: string
  /** The guild's ID */
  guildId: string
  /** The one time password */
  otp: string
}

export const otps = defineModel(
  "Otps",
  new mongoose.Schema<Otp>({
    createdAt: { type: Date, expires: "1m", required: true, default: Date.now },
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    otp: { type: String, required: true },
  }),
)
