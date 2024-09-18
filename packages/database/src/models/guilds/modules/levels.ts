import { Schema } from "mongoose"

export interface Levels {
  enabled: boolean
  channel: string
  message: string
  background?: string
  mention: boolean
  roles: {
    level: number
    role: string
  }[]
}

export const levelsSchema = new Schema<Levels>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.String, required: true },
    mention: { type: Schema.Types.Boolean, required: true },
    background: { type: Schema.Types.String },
    roles: {
      type: [
        new Schema(
          {
            level: { type: Schema.Types.Number, required: true },
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
