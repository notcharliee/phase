import { Schema } from "mongoose"

export interface Tickets {
  enabled: boolean
  channel: string
  category?: string
  message?: string
  max_open?: number
  tickets: {
    id: string
    name: string
    message: string
    mention?: string
    reason?: "required" | "optional" | "disabled"
  }[]
}

export const ticketsSchema = new Schema<Tickets>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    category: { type: Schema.Types.String },
    message: { type: Schema.Types.String },
    max_open: { type: Schema.Types.Number },
    tickets: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.UUID, required: true },
            name: { type: Schema.Types.String, required: true },
            message: { type: Schema.Types.String, required: true },
            mention: { type: Schema.Types.String },
            reason: {
              type: Schema.Types.String,
              enum: ["required", "optional", "disabled"],
            },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
