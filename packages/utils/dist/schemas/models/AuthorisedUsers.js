// src/schemas/models/AuthorisedUsers.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  identity: Object,
  guilds: Array,
  session: String,
  token: Object,
  timestamp: String
});
var AuthorisedUsers_default = mongoose.models["AuthorisedUsers"] || mongoose.model("AuthorisedUsers", Data);
export {
  AuthorisedUsers_default as default
};
