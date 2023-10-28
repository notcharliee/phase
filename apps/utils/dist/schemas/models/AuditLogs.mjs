// src/schemas/models/AuditLogs.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  channel: String,
  options: Array
});
var AuditLogs_default = mongoose.models["AuditLogs"] || mongoose.model("AuditLogs", Data);
export {
  AuditLogs_default as default
};
