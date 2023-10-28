// src/schemas/models/ReactionRoles.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  channel: String,
  message: String,
  reactions: Array
});
var ReactionRoles_default = mongoose.models["ReactionRoles"] || mongoose.model("ReactionRoles", Data);
export {
  ReactionRoles_default as default
};
