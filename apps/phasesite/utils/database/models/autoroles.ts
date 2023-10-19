import mongoose, { Schema, Document } from 'mongoose'

const Data: Schema = new mongoose.Schema({
    guild: String,
    roles: Array,
})

interface DataTypes extends Document {
    guild: string
    roles: string[]
}

export default mongoose.models['autoroles'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('autoroles', Data)