import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  channel: String,
  message: String,
  reactions: Array,
})

interface DataTypes {
  guild: string,
  channel: string,
  message: string,
  reactions: [{ emoji: string, role: string }]
}

export default mongoose.models['ReactionRoles'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('ReactionRoles', Data)