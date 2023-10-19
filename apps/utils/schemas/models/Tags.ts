import mongoose, { Schema } from 'mongoose'

const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  tags: Array,
})

interface DataTypes {
  guild: string
  tags: { name: string, value: string }[]
}

export default mongoose.models['Tags'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('Tags', Data)