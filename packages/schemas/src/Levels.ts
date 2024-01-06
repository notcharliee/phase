import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Level>({
  guild: String,
  user: String,
  level: Number,
  xp: Number,
})

export const LevelSchema = (
  mongoose.models['Levels'] as mongoose.Model<Level> ||
  mongoose.model<Level>('Levels', schema)
)


// Schema types

export type Level = {
  guild: string,
  user: string,
  level: number,
  xp: number,
}
