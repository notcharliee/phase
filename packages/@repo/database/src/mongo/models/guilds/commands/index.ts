import { Schema } from "mongoose"

export interface GuildCommand {
  disabled: boolean
  allow: (`user:${string}` | `role:${string}`)[]
  deny: (`user:${string}` | `role:${string}`)[]
}

export const commandSchema = new Schema<GuildCommand>(
  {
    disabled: { type: Schema.Types.Boolean, required: true },
    allow: { type: [Schema.Types.String], required: true },
    deny: { type: [Schema.Types.String], required: true },
  },
  { _id: false },
)
