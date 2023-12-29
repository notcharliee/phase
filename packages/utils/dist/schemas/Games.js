// src/schemas/Games.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  id: String,
  // Message ID
  type: String,
  // Dashboard admin IDs
  game_data: Object,
  // Data about the game
  players: Array
  // Players in the game
});
var GameSchema = mongoose.models["Games"] || mongoose.model("Games", schema);
export {
  GameSchema
};
