// src/schemas/models/Games.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  message: String,
  type: String,
  participants: Array,
  gameData: Object
});
var Games_default = mongoose.models["Games"] || mongoose.model("Games", Data);
export {
  Games_default as default
};
