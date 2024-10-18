import { Schema } from "mongoose"

export interface AutoMessages {
  enabled: boolean
  messages: {
    name: string
    channel: string
    message: string
    interval: number
    mention?: string
  }[]
}

export const autoMessagesSchema = new Schema<AutoMessages>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    messages: {
      type: [
        new Schema(
          {
            name: { type: Schema.Types.String, required: true },
            channel: { type: Schema.Types.String, required: true },
            message: { type: Schema.Types.String, required: true },
            interval: { type: Number, required: true },
            mention: { type: Schema.Types.String },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
