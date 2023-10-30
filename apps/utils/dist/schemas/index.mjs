// src/schemas/models/AFKs.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  user: String,
  reason: String
});
var AFKs_default = mongoose.models["AFKs"] || mongoose.model("AFKs", Data);

// src/schemas/models/AuditLogs.ts
import mongoose2 from "mongoose";
var Data2 = new mongoose2.Schema({
  guild: String,
  channel: String,
  options: Array
});
var AuditLogs_default = mongoose2.models["AuditLogs"] || mongoose2.model("AuditLogs", Data2);

// src/schemas/models/AuthorisedUsers.ts
import mongoose3 from "mongoose";
var Data3 = new mongoose3.Schema({
  identity: Object,
  guilds: Array,
  session: String,
  token: Object,
  timestamp: String
});
var AuthorisedUsers_default = mongoose3.models["AuthorisedUsers"] || mongoose3.model("AuthorisedUsers", Data3);

// src/schemas/models/AutoPartners.ts
import mongoose4 from "mongoose";
var Data4 = new mongoose4.Schema({
  guild: String,
  channel: String,
  advert: String,
  partners: Array,
  invites: Array
});
var AutoPartners_default = mongoose4.models["AutoPartners"] || mongoose4.model("AutoPartners", Data4);

// src/schemas/models/AutoRoles.ts
import mongoose5 from "mongoose";
var Data5 = new mongoose5.Schema({
  guild: String,
  roles: Array,
  pending: Boolean
});
var AutoRoles_default = mongoose5.models["AutoRoles"] || mongoose5.model("AutoRoles", Data5);

// src/schemas/models/Games.ts
import mongoose6 from "mongoose";
var Data6 = new mongoose6.Schema({
  guild: String,
  message: String,
  type: String,
  participants: Array,
  gameData: Object
});
var Games_default = mongoose6.models["Games"] || mongoose6.model("Games", Data6);

// src/schemas/models/Giveaways.ts
import mongoose7 from "mongoose";
var Data7 = new mongoose7.Schema({
  guild: String,
  message: String,
  channel: String,
  created: String,
  host: String,
  entries: Array,
  winners: Number,
  prize: String,
  expires: String,
  duration: String,
  expired: Boolean
});
var Giveaways_default = mongoose7.models["Giveaways"] || mongoose7.model("Giveaways", Data7);

// src/schemas/models/GuildInvites.ts
import mongoose8 from "mongoose";
var Data8 = new mongoose8.Schema({
  guild: String,
  invites: Array
});
var GuildInvites_default = mongoose8.models["GuildInvites"] || mongoose8.model("GuildInvites", Data8);

// src/schemas/models/JoinToCreate.ts
import mongoose9 from "mongoose";
var Data9 = new mongoose9.Schema({
  guild: String,
  channel: String,
  category: String,
  active: Array
});
var JoinToCreate_default = mongoose9.models["JoinToCreate"] || mongoose9.model("JoinToCreate", Data9);

// src/schemas/models/Levels.ts
import mongoose10 from "mongoose";
var Data10 = new mongoose10.Schema({
  guild: String,
  message: String,
  setChannel: String,
  msgChannel: Boolean,
  dmsChannel: Boolean,
  roles: Array,
  levels: Array
});
var Levels_default = mongoose10.models["Levels"] || mongoose10.model("Levels", Data10);

// src/schemas/models/ReactionRoles.ts
import mongoose11 from "mongoose";
var Data11 = new mongoose11.Schema({
  guild: String,
  channel: String,
  message: String,
  reactions: Array
});
var ReactionRoles_default = mongoose11.models["ReactionRoles"] || mongoose11.model("ReactionRoles", Data11);

// src/schemas/models/Tags.ts
import mongoose12 from "mongoose";
var Data12 = new mongoose12.Schema({
  guild: String,
  tags: Array
});
var Tags_default = mongoose12.models["Tags"] || mongoose12.model("Tags", Data12);

// src/schemas/models/Tickets.ts
import mongoose13 from "mongoose";
var Data13 = new mongoose13.Schema({
  guild: String,
  channel: String,
  panel: Object,
  tickets: Array,
  sent: Boolean
});
var Tickets_default = mongoose13.models["Tickets"] || mongoose13.model("Tickets", Data13);
export {
  AFKs_default as AFKs,
  AuditLogs_default as AuditLogs,
  AuthorisedUsers_default as AuthorisedUsers,
  AutoPartners_default as AutoPartners,
  AutoRoles_default as AutoRoles,
  Games_default as Games,
  Giveaways_default as Giveaways,
  GuildInvites_default as GuildInvites,
  JoinToCreate_default as JoinToCreate,
  Levels_default as Levels,
  ReactionRoles_default as ReactionRoles,
  Tags_default as Tags,
  Tickets_default as Tickets
};
