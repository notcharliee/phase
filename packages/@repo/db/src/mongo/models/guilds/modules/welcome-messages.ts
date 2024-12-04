import { Schema } from "mongoose"

export interface WelcomeMessages {
  enabled: boolean
  channel: string
  message: string
  mention: boolean
  card: {
    enabled: boolean
    background?: string
  }
}

export const welcomeMessagesSchema = new Schema<WelcomeMessages>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.String, required: true },
    mention: { type: Schema.Types.Boolean, required: true },
    card: new Schema(
      {
        enabled: { type: Schema.Types.Boolean, required: true },
        background: { type: Schema.Types.String },
      },
      { _id: false },
    ),
  },
  { _id: false },
)
