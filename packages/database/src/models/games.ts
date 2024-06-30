/**
 * This model will be removed soon and data will instead be stored within the message.
 */

import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Game {
  /** The ID of the game message. */
  id: string
  /** The type of game. */
  type: "TICTACTOE"
  /** The data about the game */
  game_data: {
    /** The current turn of the game. */
    current_turn: {
      /** The marker of the current turn. */
      marker: string
      /** The player whose turn it is. */
      player: string
    }
    /** The moves of the game. */
    moves: string[]
  }
  /** The user IDs of the players in the game. */
  players: string[]
}

export const Games = defineModel(
  "Games",
  new mongoose.Schema<Game>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    game_data: {
      type: new mongoose.Schema({
        current_turn: {
          marker: { type: String, required: true },
          player: { type: String, required: true },
        },
        moves: { type: [String], required: true },
      }),
      required: true,
    },
    players: { type: [String], required: true },
  }),
)
