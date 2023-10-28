"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/bot/enums.ts
var enums_exports = {};
__export(enums_exports, {
  GameType: () => GameType,
  PhaseColour: () => PhaseColour,
  PhaseEmoji: () => PhaseEmoji,
  PhaseError: () => PhaseError,
  PhaseURL: () => PhaseURL
});
module.exports = __toCommonJS(enums_exports);
var GameType = /* @__PURE__ */ ((GameType2) => {
  GameType2["TicTacToe"] = "TICTACTOE";
  return GameType2;
})(GameType || {});
var PhaseColour = /* @__PURE__ */ ((PhaseColour2) => {
  PhaseColour2["Failure"] = "#ED4245";
  PhaseColour2["GradientPrimary"] = "#8000FF";
  PhaseColour2["GradientSecondary"] = "#DB00FF";
  PhaseColour2["Primary"] = "#A400FF";
  PhaseColour2["Warning"] = "#FEE75C";
  return PhaseColour2;
})(PhaseColour || {});
var PhaseError = /* @__PURE__ */ ((PhaseError2) => {
  PhaseError2["AccessDenied"] = "You do not have the required permissions to do this.";
  PhaseError2["MemberNotFound"] = "Member not found. Make sure they are in this server, then try again.";
  PhaseError2["Unknown"] = "Something went wrong, and we're not quite sure why. Please contact Phase Support to report it.";
  return PhaseError2;
})(PhaseError || {});
var PhaseEmoji = /* @__PURE__ */ ((PhaseEmoji2) => {
  PhaseEmoji2["Announce"] = "<:d_announce:1091003807690932295> ";
  PhaseEmoji2["Coffee"] = "<:f_coffee:1150717922524794930> ";
  PhaseEmoji2["Cross"] = "<:e_cross:1161925543529304075>";
  PhaseEmoji2["Naught"] = "<:e_naught:1161927252913700884>";
  PhaseEmoji2["Explode"] = "<:a_explode:1089925207088693248> ";
  PhaseEmoji2["Failure"] = "<:a_cross:1092852415855853600> ";
  PhaseEmoji2["Lock"] = "<:b_lock:1089925211211694151> ";
  PhaseEmoji2["Locked"] = "<:b_locked:1089925208552521838> ";
  PhaseEmoji2["Pin"] = "<:a_pin:1089926621974245496>";
  PhaseEmoji2["Success"] = "<:c_check:1092852414211706880> ";
  PhaseEmoji2["Tada"] = "<a:e_tada:1091006786221395968>";
  PhaseEmoji2["ZeroWidthJoiner"] = "\u200D";
  return PhaseEmoji2;
})(PhaseEmoji || {});
var PhaseURL = /* @__PURE__ */ ((PhaseURL2) => {
  PhaseURL2["PhaseCoffee"] = "https://www.buymeacoffee.com/notcharliee";
  PhaseURL2["PhaseCommands"] = "https://phasebot.xyz/commands";
  PhaseURL2["PhaseModules"] = "https://phasebot.xyz/modules";
  PhaseURL2["PhaseSupport"] = "https://discord.gg/338tyqeg82";
  return PhaseURL2;
})(PhaseURL || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameType,
  PhaseColour,
  PhaseEmoji,
  PhaseError,
  PhaseURL
});
