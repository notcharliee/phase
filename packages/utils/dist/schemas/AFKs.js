// src/schemas/AFKs.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  user: String,
  reason: String
});
var AFKSchema = mongoose.models["AFKs"] || mongoose.model("AFKs", schema);
export {
  AFKSchema
};
