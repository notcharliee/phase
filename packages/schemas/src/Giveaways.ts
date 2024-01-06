import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Giveaway>({
  id: String,
  channel: String,
  created: String,
  host: String,
  winners: Number,
  prize: String,
  duration: String,
  expires: String,
  expired: Boolean,
})

export const GiveawaySchema = (
  mongoose.models['Giveaways'] as mongoose.Model<Giveaway> ||
  mongoose.model<Giveaway>('Giveaways', schema)
)


// Schema types

export type Giveaway = {
  id: string,
  channel: string,
  created: string,
  host: string,
  winners: number,
  prize: string,
  duration: string,
  expires: string,
  expired: boolean,
}
