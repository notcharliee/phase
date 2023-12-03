// src/schemas/models/Levels.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  message: String,
  setChannel: String,
  msgChannel: Boolean,
  dmsChannel: Boolean,
  roles: Array,
  levels: Array
});
var Levels_default = mongoose.models["Levels"] || mongoose.model("Levels", Data);
export {
  Levels_default as default
};
