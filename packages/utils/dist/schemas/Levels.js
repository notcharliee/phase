// src/schemas/Levels.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  guild: String,
  user: String,
  level: Number,
  xp: Number
});
var LevelSchema = mongoose.models["Levels"] || mongoose.model("Levels", schema);
export {
  LevelSchema
};
