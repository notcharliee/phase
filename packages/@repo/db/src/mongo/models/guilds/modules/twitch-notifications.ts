import { Schema } from "mongoose"

export interface TwitchNotifications {
  enabled: boolean
  streamers: {
    id: string
    channel: string
    mention?: string
  }[]
}

export const twitchNotificationsSchema = new Schema<TwitchNotifications>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    streamers: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.String, required: true },
            channel: { type: Schema.Types.String, required: true },
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
