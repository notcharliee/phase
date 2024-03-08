import mongoose from "mongoose"

export const ReminderSchema = (
  mongoose.models['Reminders'] as mongoose.Model<Reminder> ||
  mongoose.model<Reminder>('Reminders', new mongoose.Schema<Reminder>({
    guild: mongoose.SchemaTypes.String,
    message: mongoose.SchemaTypes.String,
    channel: mongoose.SchemaTypes.String,
    time: mongoose.SchemaTypes.Number,
    user: mongoose.SchemaTypes.String,
    role: mongoose.SchemaTypes.String,
    created: mongoose.SchemaTypes.Date,
  }))
)

export type Reminder = {
  guild: string,
  message: string,
  channel: string,
  time: number,
  user?: string,
  role?: string,
  created: Date,
}
