import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Game>({
  id: String, // Message ID
  type: String, // Dashboard admin IDs
  game_data: Object, // Data about the game
  players: Array, // Players in the game
})

export const GameSchema = (
  mongoose.models['Games'] as mongoose.Model<Game> ||
  mongoose.model<Game>('Games', schema)
)


// Schema types

export type Game = {
  id: string,
  type: string,
  game_data: GameData,
  players: string[],
}

export type GameDataTictactoe = {
  currentTurn: {
    marker: string,
    player: string,
  },
  moves: string[],
}

export type GameData = GameDataTictactoe