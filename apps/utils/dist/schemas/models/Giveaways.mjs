// src/schemas/models/Giveaways.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  message: String,
  channel: String,
  created: String,
  host: String,
  entries: Array,
  winners: Number,
  prize: String,
  expires: String,
  duration: String,
  expired: Boolean
});
var Giveaways_default = mongoose.models["Giveaways"] || mongoose.model("Giveaways", Data);
export {
  Giveaways_default as default
};
