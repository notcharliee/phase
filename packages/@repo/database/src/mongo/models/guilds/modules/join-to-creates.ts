import { Schema } from "mongoose"

export interface JoinToCreates {
  enabled: boolean
  channel: string
  category: string
}

export const joinToCreatesSchema = new Schema<JoinToCreates>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    category: { type: Schema.Types.String, required: true },
  },
  { _id: false },
)
