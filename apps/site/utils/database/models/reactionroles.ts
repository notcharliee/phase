import mongoose, { Schema, Document } from 'mongoose'

const Data: Schema = new mongoose.Schema({
    guild: String,
    channel: String,
    message: String,
    reactions: Array
})

interface DataTypes extends Document {
    guild: string
    channel: string
    message: string
    reactions: { emoji: string, role: string }[]
}

export default mongoose.models['reactionroles'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('reactionroles', Data)