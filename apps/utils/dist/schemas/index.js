"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schemas/index.ts
var schemas_exports = {};
__export(schemas_exports, {
  AFKs: () => AFKs_default,
  AuditLogs: () => AuditLogs_default,
  AuthorisedUsers: () => AuthorisedUsers_default,
  AutoPartners: () => AutoPartners_default,
  AutoRoles: () => AutoRoles_default,
  Games: () => Games_default,
  Giveaways: () => Giveaways_default,
  GuildInvites: () => GuildInvites_default,
  JoinToCreate: () => JoinToCreate_default,
  Levels: () => Levels_default,
  ReactionRoles: () => ReactionRoles_default,
  Tags: () => Tags_default,
  Tickets: () => Tickets_default
});
module.exports = __toCommonJS(schemas_exports);

// src/schemas/models/AFKs.ts
var import_mongoose = __toESM(require("mongoose"));
var Data = new import_mongoose.default.Schema({
  guild: String,
  user: String,
  reason: String
});
var AFKs_default = import_mongoose.default.models["AFKs"] || import_mongoose.default.model("AFKs", Data);

// src/schemas/models/AuditLogs.ts
var import_mongoose2 = __toESM(require("mongoose"));
var Data2 = new import_mongoose2.default.Schema({
  guild: String,
  channel: String,
  options: Array
});
var AuditLogs_default = import_mongoose2.default.models["AuditLogs"] || import_mongoose2.default.model("AuditLogs", Data2);

// src/schemas/models/AuthorisedUsers.ts
var import_mongoose3 = __toESM(require("mongoose"));
var Data3 = new import_mongoose3.default.Schema({
  identity: Object,
  guilds: Array,
  session: String,
  token: Object,
  timestamp: String
});
var AuthorisedUsers_default = import_mongoose3.default.models["AuthorisedUsers"] || import_mongoose3.default.model("AuthorisedUsers", Data3);

// src/schemas/models/AutoPartners.ts
var import_mongoose4 = __toESM(require("mongoose"));
var Data4 = new import_mongoose4.default.Schema({
  guild: String,
  channel: String,
  advert: String,
  partners: Array,
  invites: Array
});
var AutoPartners_default = import_mongoose4.default.models["AutoPartners"] || import_mongoose4.default.model("AutoPartners", Data4);

// src/schemas/models/AutoRoles.ts
var import_mongoose5 = __toESM(require("mongoose"));
var Data5 = new import_mongoose5.default.Schema({
  guild: String,
  roles: Array,
  pending: Boolean
});
var AutoRoles_default = import_mongoose5.default.models["AutoRoles"] || import_mongoose5.default.model("AutoRoles", Data5);

// src/schemas/models/Games.ts
var import_mongoose6 = __toESM(require("mongoose"));
var Data6 = new import_mongoose6.default.Schema({
  guild: String,
  message: String,
  type: String,
  participants: Array,
  gameData: Object
});
var Games_default = import_mongoose6.default.models["Games"] || import_mongoose6.default.model("Games", Data6);

// src/schemas/models/Giveaways.ts
var import_mongoose7 = __toESM(require("mongoose"));
var Data7 = new import_mongoose7.default.Schema({
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
var Giveaways_default = import_mongoose7.default.models["Giveaways"] || import_mongoose7.default.model("Giveaways", Data7);

// src/schemas/models/GuildInvites.ts
var import_mongoose8 = __toESM(require("mongoose"));
var Data8 = new import_mongoose8.default.Schema({
  guild: String,
  invites: Array
});
var GuildInvites_default = import_mongoose8.default.models["GuildInvites"] || import_mongoose8.default.model("GuildInvites", Data8);

// src/schemas/models/JoinToCreate.ts
var import_mongoose9 = __toESM(require("mongoose"));
var Data9 = new import_mongoose9.default.Schema({
  guild: String,
  channel: String,
  category: String,
  active: Array
});
var JoinToCreate_default = import_mongoose9.default.models["JoinToCreate"] || import_mongoose9.default.model("JoinToCreate", Data9);

// src/schemas/models/Levels.ts
var import_mongoose10 = __toESM(require("mongoose"));
var Data10 = new import_mongoose10.default.Schema({
  guild: String,
  message: String,
  setChannel: String,
  msgChannel: Boolean,
  dmsChannel: Boolean,
  roles: Array,
  levels: Array
});
var Levels_default = import_mongoose10.default.models["Levels"] || import_mongoose10.default.model("Levels", Data10);

// src/schemas/models/ReactionRoles.ts
var import_mongoose11 = __toESM(require("mongoose"));
var Data11 = new import_mongoose11.default.Schema({
  guild: String,
  channel: String,
  message: String,
  reactions: Array
});
var ReactionRoles_default = import_mongoose11.default.models["ReactionRoles"] || import_mongoose11.default.model("ReactionRoles", Data11);

// src/schemas/models/Tags.ts
var import_mongoose12 = __toESM(require("mongoose"));
var Data12 = new import_mongoose12.default.Schema({
  guild: String,
  tags: Array
});
var Tags_default = import_mongoose12.default.models["Tags"] || import_mongoose12.default.model("Tags", Data12);

// src/schemas/models/Tickets.ts
var import_mongoose13 = __toESM(require("mongoose"));
var Data13 = new import_mongoose13.default.Schema({
  guild: String,
  channel: String,
  panel: Object,
  tickets: Array,
  sent: Boolean
});
var Tickets_default = import_mongoose13.default.models["Tickets"] || import_mongoose13.default.model("Tickets", Data13);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AFKs,
  AuditLogs,
  AuthorisedUsers,
  AutoPartners,
  AutoRoles,
  Games,
  Giveaways,
  GuildInvites,
  JoinToCreate,
  Levels,
  ReactionRoles,
  Tags,
  Tickets
});
