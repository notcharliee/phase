var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/bot/functions.ts
var functions_exports = {};
__export(functions_exports, {
  alertDevs: () => alertDevs,
  clientButtonEvent: () => clientButtonEvent,
  clientError: () => clientError,
  clientEvent: () => clientEvent,
  clientLoop: () => clientLoop,
  clientModalEvent: () => clientModalEvent,
  clientSlashCommand: () => clientSlashCommand,
  formatDate: () => formatDate,
  formatNumber: () => formatNumber,
  getPermissionName: () => getPermissionName,
  getRandomArrayElements: () => getRandomArrayElements
});
import * as Discord from "discord.js";

// src/bot/enums.ts
var enums_exports = {};
__export(enums_exports, {
  GameType: () => GameType,
  PhaseColour: () => PhaseColour,
  PhaseEmoji: () => PhaseEmoji,
  PhaseError: () => PhaseError,
  PhaseURL: () => PhaseURL
});
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

// src/index.ts
var createEnv = (env2) => env2;
var env = createEnv({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_SECRET: process.env.DISCORD_SECRET,
  DISCORD_ID: process.env.DISCORD_ID,
  WEBHOOK_ALERT: process.env.WEBHOOK_ALERT,
  WEBHOOK_STATUS: process.env.WEBHOOK_STATUS,
  API_YOUTUBE: process.env.API_YOUTUBE
});

// src/bot/functions.ts
async function alertDevs(data) {
  if (typeof env.WEBHOOK_ALERT != "string")
    throw new Error("Alert webhook connection URL not found.");
  const webhookClient = new Discord.WebhookClient({
    url: env.WEBHOOK_ALERT
  });
  let emoji = "\u26A0\uFE0F ";
  if (data.type == "message")
    emoji = enums_exports.PhaseEmoji.Announce;
  else if (data.type == "error")
    emoji = enums_exports.PhaseEmoji.Failure;
  const webhookAlert = await webhookClient.send({
    embeds: [
      new Discord.EmbedBuilder().setTitle(emoji + data.title).setDescription(data.description ?? null).setColor(data.type == "message" ? enums_exports.PhaseColour.Primary : data.type == "warning" ? enums_exports.PhaseColour.Warning : enums_exports.PhaseColour.Failure).setTimestamp().setFooter({ text: env.NODE_ENV == "development" ? "Phase [Alpha]" : "Phase [Production]" })
    ]
  });
  if (data.type == "message" || "warning")
    console.log(`[Alert] ${data.title}
\u27A4 https://discord.com/channels/1078130365421596733/${webhookAlert.channel_id}/${webhookAlert.id}`);
  else
    throw new Error(data.title && data.description ? `${data.title} 
${data.description}` : data.title);
}
function clientError(interaction, title, error, ephemeral, deffered) {
  const interactionReplyOptions = {
    components: [
      new Discord.ActionRowBuilder().setComponents(
        new Discord.ButtonBuilder().setLabel("Report Bug").setStyle(Discord.ButtonStyle.Link).setURL(enums_exports.PhaseURL.PhaseSupport)
      )
    ],
    embeds: [
      new Discord.EmbedBuilder().setColor(enums_exports.PhaseColour.Failure).setDescription(error).setTitle(enums_exports.PhaseEmoji.Failure + title)
    ],
    ephemeral
  };
  const throwError = (error2) => functions_exports.alertDevs({
    title: `\`clientError()\` Failure`,
    description: `${error2}`,
    type: "warning"
  });
  if (interaction.isChatInputCommand())
    deffered ? interaction.editReply(interactionReplyOptions) : interaction.reply(interactionReplyOptions).catch(() => {
      interaction.editReply(interactionReplyOptions);
    }).catch((error2) => {
      throwError(error2);
    });
  if (interaction.isButton())
    deffered ? interaction.followUp(interactionReplyOptions) : interaction.reply(interactionReplyOptions).catch(() => {
      interaction.editReply(interactionReplyOptions);
    }).catch((error2) => {
      throwError(error2);
    });
  if (interaction.isModalSubmit())
    deffered ? interaction.editReply(interactionReplyOptions) : interaction.reply(interactionReplyOptions).catch(() => {
      interaction.editReply(interactionReplyOptions);
    }).catch((error2) => {
      throwError(error2);
    });
}
function clientSlashCommand({ data, permissions, execute }) {
  return {
    data: data.toJSON(),
    permissions,
    execute
  };
}
function clientButtonEvent({ customId, execute }) {
  return clientEvent({
    name: "interactionCreate",
    async execute(client, interaction) {
      if (!interaction.isButton())
        return;
      if (customId instanceof RegExp && !customId.test(interaction.customId) || customId instanceof String && customId != interaction.customId)
        return;
      execute(client, interaction).catch((error) => {
        alertDevs({
          title: "Button execution failed",
          description: `${error}`,
          type: "error"
        });
      });
    }
  });
}
function clientModalEvent({ customId, fromMessage, execute }) {
  return clientEvent({
    name: "interactionCreate",
    async execute(client, interaction) {
      if (!interaction.isModalSubmit())
        return;
      if (fromMessage && !interaction.isFromMessage())
        return;
      if (customId instanceof RegExp && !customId.test(interaction.customId) || customId instanceof String && customId != interaction.customId)
        return;
      execute(client, interaction).catch((error) => {
        alertDevs({
          title: "Modal execution failed",
          description: `${error}`,
          type: "error"
        });
      });
    }
  });
}
function clientEvent({ name, execute }) {
  return {
    name,
    execute
  };
}
function clientLoop({ name, interval, execute }) {
  return {
    name,
    interval,
    execute
  };
}
function getPermissionName(permission) {
  for (const perm of Object.keys(Discord.PermissionFlagsBits))
    if (Discord.PermissionFlagsBits[perm] == permission)
      return perm;
  return "UnknownPermission";
}
function getRandomArrayElements(array, amount) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, amount);
}
function formatDate(date) {
  return `${"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")[date.getUTCDay()]} ${"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",")[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${("0" + (date.getUTCHours() % 12 || 12)).slice(-2)}:${("0" + date.getUTCMinutes()).slice(-2)} ${date.getUTCHours() >= 12 ? "PM" : "AM"}`;
}
function formatNumber(number) {
  if (number >= 1e9)
    return (number / 1e9).toFixed(1) + "B";
  else if (number >= 1e6)
    return (number / 1e6).toFixed(1) + "M";
  else if (number >= 1e3)
    return (number / 1e3).toFixed(1) + "K";
  else
    return number.toString();
}
export {
  alertDevs,
  clientButtonEvent,
  clientError,
  clientEvent,
  clientLoop,
  clientModalEvent,
  clientSlashCommand,
  formatDate,
  formatNumber,
  getPermissionName,
  getRandomArrayElements
};
