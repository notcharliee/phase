// src/schemas/Games.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  id: String,
  // Message ID
  type: String,
  // Dashboard admin IDs
  game_data: Object,
  // Data about the game
  players: Array
  // Players in the game
});
var GameSchema = mongoose.models["Games"] || mongoose.model("Games", schema);

// src/schemas/Giveaways.ts
import mongoose2 from "mongoose";
var schema2 = new mongoose2.Schema({
  id: String,
  channel: String,
  created: String,
  host: String,
  winners: Number,
  prize: String,
  duration: String,
  expires: String,
  expired: Boolean
});
var GiveawaySchema = mongoose2.models["Giveaways"] || mongoose2.model("Giveaways", schema2);

// src/schemas/Guilds.ts
import mongoose3 from "mongoose";
var schema3 = new mongoose3.Schema({
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
var GuildSchema = mongoose3.models["Guilds"] || mongoose3.model("Guilds", schema3);

// src/schemas/Levels.ts
import mongoose4 from "mongoose";
var schema4 = new mongoose4.Schema({
  guild: String,
  user: String,
  level: Number,
  xp: Number
});
var LevelSchema = mongoose4.models["Levels"] || mongoose4.model("Levels", schema4);
export {
  GameSchema,
  GiveawaySchema,
  GuildSchema,
  LevelSchema
};
