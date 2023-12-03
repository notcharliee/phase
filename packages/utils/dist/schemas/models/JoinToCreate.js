// src/schemas/models/JoinToCreate.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  channel: String,
  category: String,
  active: Array
});
var JoinToCreate_default = mongoose.models["JoinToCreate"] || mongoose.model("JoinToCreate", Data);
export {
  JoinToCreate_default as default
};
