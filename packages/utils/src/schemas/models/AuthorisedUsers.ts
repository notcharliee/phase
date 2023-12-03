import mongoose, { Schema } from 'mongoose'

import * as discord_api_types_v10 from 'discord-api-types/v10'
import { UUID } from 'crypto'


const Data: Schema = new mongoose.Schema<DataTypes>({
  identity: Object,
  guilds: Array,
  session: String,
  token: Object,
  timestamp: String,
})

interface DataTypes {
  identity: discord_api_types_v10.APIUser,
  guilds: discord_api_types_v10.RESTGetAPICurrentUserGuildsResult,
  session: UUID,
  token: discord_api_types_v10.RESTPostOAuth2AccessTokenResult,
  timestamp: string,
}

export default mongoose.models['AuthorisedUsers'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('AuthorisedUsers', Data)