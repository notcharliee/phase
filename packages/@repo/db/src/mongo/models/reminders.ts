import mongoose from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface Reminder {
  name: string // lorem ipsum
  guild: string // 123456789012345678
  channel: string // 123456789012345678
  content: string // lorem ipsum dolor sit amet
  mention?: string // <@123456789012345678>
  delay: number // 60_000 -> 1 minute
  loop: boolean // false
  createdAt: Date // 2023-07-01T00:00:00.000Z
  scheduledAt: Date // 2023-07-01T00:01:00.000Z
}

export const reminders = defineModel(
  "Reminders",
  new mongoose.Schema<Reminder>({
    name: { type: String, required: true },
    guild: { type: String, required: true },
    channel: { type: String, required: true },
    content: { type: String, required: true },
    mention: { type: String },
    delay: { type: Number, required: true, min: 0 },
    loop: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    scheduledAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + this.delay)
      },
    },
  }),
  {
    guild: true,
    scheduledAt: true,
  },
)
