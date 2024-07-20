import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Giveaway {
  /** The ID of the giveaway. */
  id: string
  /** The channel the giveaway is in. */
  channel: string
  /** The giveaway's creation date in unix epoch millisecond time. */
  created: string
  /** The giveaway host's user ID. */
  host: string
  /** The number of winners to select when the giveaway ends. */
  winners: number
  /** The prize of the giveaway. */
  prize: string
  /** The duration of the giveaway in milliseconds. */
  duration: string
  /** The date the giveaway expires in unix epoch millisecond time. */
  expires: string
  /** Whether or not the giveaway has expired. */
  expired: boolean
}

export const giveaways = defineModel(
  "Giveaways",
  new mongoose.Schema<Giveaway>({
    id: { type: String, required: true },
    channel: { type: String, required: true },
    created: { type: String, required: true },
    host: { type: String, required: true },
    winners: { type: Number, required: true },
    prize: { type: String, required: true },
    duration: { type: String, required: true },
    expires: { type: String, required: true },
    expired: { type: Boolean, required: true },
  }),
)
