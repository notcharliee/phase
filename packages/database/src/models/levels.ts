import { Schema } from "mongoose"

import { defineModel } from "~/utils"

export interface Level {
  guild: string
  user: string
  level: number
  xp: number
}

const levelsSchema = new Schema<Level>({
  guild: { type: Schema.Types.String, required: true },
  user: { type: Schema.Types.String, required: true },
  level: { type: Schema.Types.Number, required: true },
  xp: { type: Schema.Types.Number, required: true },
})

levelsSchema.index({ guild: 1, level: -1, xp: -1 })
levelsSchema.index({ guild: 1, user: 1 })

export const levels = defineModel("Levels", levelsSchema)
