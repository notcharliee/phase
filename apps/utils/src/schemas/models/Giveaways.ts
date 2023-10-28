import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  message: String,
  channel: String,
  created: String,
  host: String,
  entries: Array,
  winners: Number,
  prize: String,
  expires: String,
  duration: String,
  expired: Boolean,
})

interface DataTypes {
  guild: string,
  message: string,
  channel: string,
  created: string,
  host: string,
  entries: string[],
  winners: number,
  prize: string,
  expires: string,
  duration: string,
  expired: boolean,
}

export default mongoose.models['Giveaways'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('Giveaways', Data)