// src/AFKs.ts
import mongoose from "mongoose";
var schema = new mongoose.Schema({
  user: String,
  reason: String
});
var AFKSchema = mongoose.models["AFKs"] || mongoose.model("AFKs", schema);

// src/Games.ts
import mongoose2 from "mongoose";
var schema2 = new mongoose2.Schema({
  id: String,
  // Message ID
  type: String,
  // Dashboard admin IDs
  game_data: Object,
  // Data about the game
  players: Array
  // Players in the game
});
var GameSchema = mongoose2.models["Games"] || mongoose2.model("Games", schema2);

// src/Giveaways.ts
import mongoose3 from "mongoose";
var schema3 = new mongoose3.Schema({
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
var GiveawaySchema = mongoose3.models["Giveaways"] || mongoose3.model("Giveaways", schema3);

// src/Guilds.ts
import mongoose4 from "mongoose";
var GuildSchema = mongoose4.models["Guilds"] || mongoose4.model(
  "Guilds",
  new mongoose4.Schema({
    id: String,
    // Guild ID
    admins: Array,
    // Dashboard admin IDs
    commands: Object,
    // Commands config
    modules: Object,
    // Modules config
    news_channel: String
    // Bot news channel
  })
);

// src/Levels.ts
import mongoose5 from "mongoose";
var schema4 = new mongoose5.Schema({
  guild: String,
  user: String,
  level: Number,
  xp: Number
});
var LevelSchema = mongoose5.models["Levels"] || mongoose5.model("Levels", schema4);

// src/Reminders.ts
import mongoose6 from "mongoose";
var ReminderSchema = mongoose6.models["Reminders"] || mongoose6.model("Reminders", new mongoose6.Schema({
  guild: mongoose6.SchemaTypes.String,
  name: mongoose6.SchemaTypes.String,
  message: mongoose6.SchemaTypes.String,
  channel: mongoose6.SchemaTypes.String,
  time: mongoose6.SchemaTypes.Number,
  loop: mongoose6.SchemaTypes.Boolean,
  user: mongoose6.SchemaTypes.String,
  role: mongoose6.SchemaTypes.String,
  created: mongoose6.SchemaTypes.Date,
  unsent: mongoose6.SchemaTypes.Boolean
}));

// src/Tags.ts
import mongoose7 from "mongoose";
var schema5 = new mongoose7.Schema({
  guild: String,
  tags: Array
});
var TagSchema = mongoose7.models["Tags"] || mongoose7.model("Tags", schema5);
export {
  AFKSchema,
  GameSchema,
  GiveawaySchema,
  GuildSchema,
  LevelSchema,
  ReminderSchema,
  TagSchema
};
