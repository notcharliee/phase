import mongoose, { Schema } from 'mongoose'

const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  invites: Array,
})

interface DataTypes {
  guild: string,
  invites: {
    channel: string | null,
    code: string,
    created: Date | null,
    expires: Date | null,
    inviter: string | null,
    maxAge: number | null,
    maxUses: number | null,
    targetUser: string | null,
    temporary: boolean | null,
    uses: number | null,
  }[],
}

export default mongoose.models['GuildInvites'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('GuildInvites', Data)