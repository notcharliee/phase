import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  roles: Array,
  pending: Boolean,
})

interface DataTypes {
  guild: string,
  roles: string[],
  pending: boolean,
}

export default mongoose.models['AutoRoles'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('AutoRoles', Data)