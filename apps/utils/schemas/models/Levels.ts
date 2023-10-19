import mongoose, { Schema } from 'mongoose'

const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  message: String,
  setChannel: String,
  msgChannel: Boolean,
  dmsChannel: Boolean,
  roles: Array,
  levels: Array,
})

interface DataTypes {
  guild: string
  message: string
  setChannel: string
  msgChannel: boolean
  dmsChannel: boolean
  roles: { level: number, role: string }[]
  levels: { id: string, level: number, xp: number, target: number }[]
}

export default mongoose.models['Levels'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('Levels', Data)