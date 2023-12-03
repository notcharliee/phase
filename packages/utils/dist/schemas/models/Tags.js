// src/schemas/models/Tags.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  tags: Array
});
var Tags_default = mongoose.models["Tags"] || mongoose.model("Tags", Data);
export {
  Tags_default as default
};
