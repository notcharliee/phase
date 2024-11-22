import { Schema } from "mongoose"

export interface BumpReminders {
  enabled: boolean
  time: number
  initialMessage: string
  reminderMessage: string
  mention?: string
}

export const bumpRemindersSchema = new Schema<BumpReminders>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    time: { type: Schema.Types.Number, required: true },
    initialMessage: { type: Schema.Types.String, required: true },
    reminderMessage: { type: Schema.Types.String, required: true },
    mention: { type: Schema.Types.String },
  },
  { _id: false },
)
