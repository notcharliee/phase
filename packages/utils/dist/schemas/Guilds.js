// src/schemas/Guilds.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  id: String,
  // Guild ID
  admins: Array,
  // Dashboard admin IDs
  commands: Object,
  // Commands config
  modules: Object,
  // Modules config
  news_channel: String,
  // Bot news channel
  owner: String
  // Guild owner ID
});
var GuildSchema = mongoose.models["Guilds"] || mongoose.model("Guilds", schema);
export {
  GuildSchema
};
