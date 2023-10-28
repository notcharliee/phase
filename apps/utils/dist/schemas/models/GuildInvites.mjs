// src/schemas/models/GuildInvites.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  invites: Array
});
var GuildInvites_default = mongoose.models["GuildInvites"] || mongoose.model("GuildInvites", Data);
export {
  GuildInvites_default as default
};
