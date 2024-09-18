import { Schema } from "mongoose"

export interface Warnings {
  enabled: boolean
  warnings: string[]
}

export const warningsSchema = new Schema<Warnings>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    warnings: { type: [Schema.Types.String], required: true },
  },
  { _id: false },
)
