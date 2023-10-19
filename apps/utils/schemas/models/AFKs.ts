import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  user: String,
  reason: String,
})

interface DataTypes {
  guild: string,
  user: string,
  reason: string,
}

export default mongoose.models['AFKs'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('AFKs', Data)