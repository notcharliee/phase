import { Schema } from "mongoose"

export interface Tickets {
  enabled: boolean
  channel: string
  max_open?: number
  tickets: {
    id: string
    name: string
    message: string
    mention?: string
  }[]
}

export const ticketsSchema = new Schema<Tickets>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    max_open: { type: Schema.Types.Number, required: true },
    tickets: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.String, required: true },
            name: { type: Schema.Types.String, required: true },
            message: { type: Schema.Types.String, required: true },
            mention: Schema.Types.String,
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
