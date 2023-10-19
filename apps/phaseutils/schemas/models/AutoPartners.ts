import mongoose, { Schema } from 'mongoose'

const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  channel: String,
  advert: String,
  partners: Array,
  invites: Array
})

interface DataTypes {
  guild: string
  channel: string | undefined
  advert: string | undefined
  partners: { guildId: string, channelId: string, messageId: string }[]
  invites: { code: string, expires: string }[]
}

export default mongoose.models['AutoPartners'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('AutoPartners', Data)