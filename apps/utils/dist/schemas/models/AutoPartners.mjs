// src/schemas/models/AutoPartners.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  channel: String,
  advert: String,
  partners: Array,
  invites: Array
});
var AutoPartners_default = mongoose.models["AutoPartners"] || mongoose.model("AutoPartners", Data);
export {
  AutoPartners_default as default
};
