// src/schemas/models/AutoRoles.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  roles: Array,
  pending: Boolean
});
var AutoRoles_default = mongoose.models["AutoRoles"] || mongoose.model("AutoRoles", Data);
export {
  AutoRoles_default as default
};
