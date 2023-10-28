// src/schemas/models/AFKs.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  user: String,
  reason: String
});
var AFKs_default = mongoose.models["AFKs"] || mongoose.model("AFKs", Data);
export {
  AFKs_default as default
};
