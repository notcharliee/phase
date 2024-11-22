import { Schema } from "mongoose"

export interface ReactionRoles {
  enabled: boolean
  channel: string
  message: string
  reactions: {
    emoji: string
    role: string
  }[]
}

export const reactionRolesSchema = new Schema<ReactionRoles>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.String, required: true },
    reactions: {
      type: [
        new Schema(
          {
            emoji: { type: Schema.Types.String, required: true },
            role: { type: Schema.Types.String, required: true },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
