import mongoose, { Schema } from 'mongoose'


const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  message: String,
  type: String,
  participants: Array,
  gameData: Object,
})

interface DataTypes {
  guild: string,
  message: string,
  type: 'TICTACTOE',
  participants: string[],
  gameData: {
    currentTurn: { participant: string, marker: string },
    moves: string[],
  },
}

export default mongoose.models['Games'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('Games', Data)