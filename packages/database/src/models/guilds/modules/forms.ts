import { Schema } from "mongoose"

export interface Forms {
  enabled: boolean
  channel: string
  forms: {
    id: string
    name: string
    channel: string
    questions: {
      label: string
      type: "string" | "number" | "boolean"
      required: boolean
      choices?: string[]
      min?: number
      max?: number
    }[]
  }[]
}

export const formsSchema = new Schema<Forms>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channel: { type: Schema.Types.String, required: true },
    forms: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.String, required: true },
            name: { type: Schema.Types.String, required: true },
            channel: { type: Schema.Types.String, required: true },
            questions: {
              type: [
                new Schema(
                  {
                    label: { type: Schema.Types.String, required: true },
                    type: { type: Schema.Types.String, required: true },
                    required: { type: Schema.Types.Boolean, required: true },
                    choices: { type: [Schema.Types.String], required: false },
                    min: { type: Schema.Types.Number, required: false },
                    max: { type: Schema.Types.Number, required: false },
                  },
                  { _id: false },
                ),
              ],
              required: true,
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
