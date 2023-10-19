import mongoose, { Schema, Document } from 'mongoose'

const Data: Schema = new mongoose.Schema({
    guild: String,
    channel: String,
    category: String,
    active: Array
})

interface DataTypes extends Document {
    guild: string
    channel: string
    category: string
    active: string[]
}

export default mongoose.models['jointocreate'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('jointocreate', Data)