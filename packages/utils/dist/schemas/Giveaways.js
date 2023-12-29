// src/schemas/Giveaways.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  id: String,
  channel: String,
  created: String,
  host: String,
  winners: Number,
  prize: String,
  duration: String,
  expires: String,
  expired: Boolean
});
var GiveawaySchema = mongoose.models["Giveaways"] || mongoose.model("Giveaways", schema);
export {
  GiveawaySchema
};
