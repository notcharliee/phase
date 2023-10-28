#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// src/dotenv.ts
var dotenv_exports = {};
__export(dotenv_exports, {
  configEnvVars: () => configEnvVars
});
function configEnvVars() {
  const envPath = path.resolve(process.cwd(), "..", "..", ".env");
  if (!fs.existsSync(envPath))
    throw new Error("Could not find .env file.");
  else if (process.cwd().includes("bot"))
    dotenv.configDotenv({ path: envPath });
  else if (process.cwd().includes("site")) {
    const localEnvPath = path.resolve(process.cwd(), ".env.local");
    const envData = fs.readFileSync(envPath);
    fs.writeFileSync(localEnvPath, envData);
  }
}
var dotenv, fs, path;
var init_dotenv = __esm({
  "src/dotenv.ts"() {
    "use strict";
    dotenv = __toESM(require("dotenv"));
    fs = __toESM(require("fs"));
    path = __toESM(require("path"));
    configEnvVars();
  }
});

// src/cli.ts
var args = process.argv.slice(2);
if (args.length !== 1) {
  console.log(`Error: No command specified.`);
  process.exit();
}
var command = args[0];
switch (command) {
  case "dotenv":
    init_dotenv();
    break;
  default: {
    console.log(`Error: "utils ${command}" is not a valid command.`);
    process.exit();
  }
}
