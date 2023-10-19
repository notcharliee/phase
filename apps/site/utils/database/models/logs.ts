import mongoose, { Schema, Document } from 'mongoose'

const Data: Schema = new mongoose.Schema({
    guild: String,
    channel: String,
    options: Object
})

interface DataTypes extends Document {
    guild: string
    channel: string
    options: {
        channel: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        emoji: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        bans: {
            add: { enabled: boolean, channel: string }
            remove: { enabled: boolean, channel: string }
        }
        event: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        member: {
            add: { enabled: boolean, channel: string }
            remove: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        guild: {
            update: { enabled: boolean, channel: string }
        }
        invite: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            use: { enabled: boolean, channel: string }
        }
        message: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
            bulkdelete: { enabled: boolean, channel: string }
        }
        role: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        sticker: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        thread: {
            create: { enabled: boolean, channel: string }
            delete: { enabled: boolean, channel: string }
            update: { enabled: boolean, channel: string }
        }
        voice: {
            update: { enabled: boolean, channel: string }
        }
    }
}

export default mongoose.models['logs'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('logs', Data)