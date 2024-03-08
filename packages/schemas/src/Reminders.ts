import mongoose from "mongoose"

export const ReminderSchema = (
  mongoose.models['Reminders'] as mongoose.Model<Reminder> ||
  mongoose.model<Reminder>('Reminders', new mongoose.Schema<Reminder>({
    guild: mongoose.SchemaTypes.String,
    name: mongoose.SchemaTypes.String,
    message: mongoose.SchemaTypes.String,
    channel: mongoose.SchemaTypes.String,
    time: mongoose.SchemaTypes.Number,
    loop: mongoose.SchemaTypes.Boolean,
    user: mongoose.SchemaTypes.String,
    role: mongoose.SchemaTypes.String,
    created: mongoose.SchemaTypes.Date,
    unsent: mongoose.SchemaTypes.Boolean,
  }))
)

export type Reminder = {
  guild: string,
  name?: string,
  message: string,
  channel: string,
  time: number,
  loop?: boolean,
  user?: string,
  role?: string,
  created: Date,
  unsent?: boolean, // Used to determine if the reminder has been sent. If not, the bot will send it when the created date is in the past.
}
