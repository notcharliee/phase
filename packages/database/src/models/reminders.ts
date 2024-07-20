import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Reminder {
  /** The guild's ID. */
  guild: string
  /** The name of the reminder. */
  name?: string
  /** The message to send. */
  message: string
  /** The channel to send the message to. */
  channel: string
  /** The number of milliseconds to wait before sending the message (from time of creation). */
  time: number
  /** Whether or not the reminder is looping. */
  loop: boolean
  /** The user who created the reminder. */
  user?: string
  /** The role to ping when the reminder is sent. */
  role?: string
  /** The date the reminder was created. */
  created: Date
  /** Whether or not the reminder has been sent yet.
   *
   * @remarks If unsent is `true` and the creation date is in the future, the reminder will only be sent once the date is in the past.
   */
  unsent?: boolean
}

export const reminders = defineModel(
  "Reminders",
  new mongoose.Schema<Reminder>({
    guild: { type: String, required: true },
    name: { type: String },
    message: { type: String, required: true },
    channel: { type: String, required: true },
    time: { type: Number, required: true },
    loop: { type: Boolean },
    user: { type: String },
    role: { type: String },
    created: { type: Date, required: true },
    unsent: { type: Boolean },
  }),
)
