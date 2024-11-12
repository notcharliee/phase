import { Schema } from "mongoose"

export interface Counters {
  enabled: boolean
  counters: {
    name: string
    channel: string
    content: string
  }[]
}

export const countersSchema = new Schema<Counters>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    counters: {
      type: [
        new Schema(
          {
            // name: { type: Schema.Types.String, required: true },
            channel: { type: Schema.Types.String, required: true },
            content: { type: Schema.Types.String, required: true },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
