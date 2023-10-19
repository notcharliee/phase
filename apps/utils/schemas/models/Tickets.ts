import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  channel: String,
  panel: Object,
  tickets: Array,
  sent: Boolean,
})

interface DataTypes {
  guild: string,
  channel: string,
  panel: {
    message: string,
    embed: {
      title: string,
      message: string,
      colour: string
    },
    buttons: {
      name: string,
      id: string,
    }[],
  },
  tickets: [
    {
      id: string,
      name: string,
      category: string,
      message: string,
      embed?: {
        title: string,
        message: string,
        colour: string,
      },
      permissions?: {
        access: [string],
        locked: {
          close: boolean,
          reopen: boolean,
          delete: boolean
        }
      },
      count: number
    }
  ],
  sent: boolean,
}

export default mongoose.models['Tickets'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('Tickets', Data)