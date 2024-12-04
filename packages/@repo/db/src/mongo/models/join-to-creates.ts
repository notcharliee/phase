import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface JoinToCreate {
  guild: string
  channel: string
  owner: string
  createdAt: Date
}

const joinToCreateSchema = new Schema<JoinToCreate>({
  guild: { type: String, required: true },
  channel: { type: String, required: true },
  owner: { type: String, required: true },
  createdAt: { type: Date, required: true, expires: "1d", default: Date.now },
})

joinToCreateSchema.index({ guild: 1, channel: 1 })

export const joinToCreates = defineModel("JoinToCreates", joinToCreateSchema)
