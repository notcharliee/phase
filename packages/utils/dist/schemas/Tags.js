// src/schemas/Tags.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  guild: String,
  tags: Array
});
var TagSchema = mongoose.models["Tags"] || mongoose.model("Tags", schema);
export {
  TagSchema
};
