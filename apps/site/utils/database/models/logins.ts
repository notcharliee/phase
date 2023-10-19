import mongoose, { Schema, Document } from 'mongoose'
import { RESTGetAPICurrentUserResult, RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/rest/v10'

const Data: Schema = new mongoose.Schema({
    user: Object,
    guilds: Array,
    session_id: String,
    refresh_token: String
})

interface DataTypes extends Document {
    user: RESTGetAPICurrentUserResult
    guilds: RESTGetAPICurrentUserGuildsResult
    session_id: string
    refresh_token: string
}

export default mongoose.models['logins'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('logins', Data)