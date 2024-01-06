import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<AFK>({
  user: String,
  reason: String,
})

export const AFKSchema = (
  mongoose.models['AFKs'] as mongoose.Model<AFK> ||
  mongoose.model<AFK>('AFKs', schema)
)


// Schema types

export type AFK = {
  user: string,
  reason: string,
}
