// src/schemas/models/Tickets.ts
import mongoose from "mongoose";
var Data = new mongoose.Schema({
  guild: String,
  channel: String,
  panel: Object,
  tickets: Array,
  sent: Boolean
});
var Tickets_default = mongoose.models["Tickets"] || mongoose.model("Tickets", Data);
export {
  Tickets_default as default
};
