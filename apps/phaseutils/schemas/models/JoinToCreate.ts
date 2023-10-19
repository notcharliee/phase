import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  channel: String,
  category: String,
  active: Array,
})

interface DataTypes {
  guild: string,
  channel: string,
  category: string,
  active: string[]
}

export default mongoose.models['JoinToCreate'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('JoinToCreate', Data)