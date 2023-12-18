#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";
import { spawn } from "child_process";
import { pathToFileURL } from "url";

// src/index.ts
import {
  existsSync,
  readFileSync
} from "fs";
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
var getEnvVariables = (envPath) => {
  const envVariables = {};
  if (!existsSync(envPath))
    return void 0;
  const envFileContent = readFileSync(envPath, "utf-8");
  const lines = envFileContent.split("\n");
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("#") || trimmedLine == "")
      continue;
    const [key, ...value] = trimmedLine.split("=");
    if (key && value)
      envVariables[key.trim()] = value.join("=").trim().replaceAll(`"`, "");
  }
  return envVariables;
};

// src/cli.ts
import { resolve } from "path";

// package.json
var package_default = {
  private: true,
  name: "@repo/utils",
  type: "module",
  version: "1.0.0",
  author: "@notcharliee",
  license: "CC-BY-NC-4.0",
  bin: "./dist/cli.js",
  main: "./dist/index.js",
  module: "./dist/index.js",
  typings: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.js"
    },
    "./bot": {
      types: "./dist/bot/index.d.ts",
      import: "./dist/bot/index.js",
      require: "./dist/bot/index.js"
    },
    "./schemas": {
      types: "./dist/schemas/index.d.ts",
      import: "./dist/schemas/index.js",
      require: "./dist/schemas/index.js"
    }
  },
  dependencies: {
    chalk: "^5.3.0",
    commander: "^11.1.0",
    "discord-api-types": "^0.37.61",
    "discord.js": "^14.12.1",
    mongoose: "^7.4.3"
  },
  devDependencies: {
    "@repo/tsconfig": "workspace:*",
    "@types/node": "^20.8.9",
    tsup: "^7.2.0",
    typescript: "^5.3.2"
  }
};

// src/cli.ts
import chalk from "chalk";
var cli = new Command().name(package_default.name).version(package_default.version);
cli.command("build").description("Runs an app's build script.").requiredOption(
  "-a, --app <STRING>",
  "Specify the app."
).action(async (options) => {
  const config = await getPhaseConfig();
  const script = config.scripts.find((script2) => script2.app == options.app);
  if (!script || !script.build) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Build Script Not Found
`,
      `${chalk.redBright(chalk.bold("\u21B3"))} `,
      `Could not find a build script for '${options.app}' in 'phase.config.js'.`
    );
    process.exit();
  }
  spawnChildProcess(script.build, resolve(process.cwd(), "apps", script.app));
});
cli.command("start").description("Runs an app's start script.").requiredOption(
  "-a, --app <STRING>",
  "Specify the app."
).action(async (options) => {
  const config = await getPhaseConfig();
  const script = config.scripts.find((script2) => script2.app == options.app);
  if (!script || !script.start) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Start Script Not Found
`,
      `${chalk.redBright(chalk.bold("\u21B3"))} `,
      `Could not find a start script for '${options.app}' in 'phase.config.js'.`
    );
    process.exit();
  }
  spawnChildProcess(script.start, resolve(process.cwd(), "apps", script.app));
});
cli.command("dev").description("Runs an app's dev script.").requiredOption(
  "-a, --app <STRING>",
  "Specify the app."
).action(async (options) => {
  const config = await getPhaseConfig();
  const script = config.scripts.find((script2) => script2.app == options.app);
  if (!script || !script.dev) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Dev Script Not Found
`,
      `${chalk.redBright(chalk.bold("\u21B3"))} `,
      `Could not find a dev script for '${options.app}' in 'phase.config.js'.`
    );
    process.exit();
  }
  spawnChildProcess(script.dev, resolve(process.cwd(), "apps", script.app));
});
cli.parse(process.argv);
function spawnChildProcess(command, cwd) {
  const globalEnvVariables = getEnvVariables(resolve(cwd, "..", "..", ".env"));
  process.env = globalEnvVariables ? { ...globalEnvVariables, ...process.env } : process.env;
  process.env.FORCE_COLOR = "true";
  const [cmd, ...args] = command.split(" ");
  const childProcess = spawn(process.platform == "win32" ? cmd.replace("npm", "npm.cmd").replace("npx", "npx.cmd") : cmd, args, { cwd, env: process.env });
  childProcess.on("error", (error) => {
    throw error;
  });
  childProcess.stdout.on("data", (data) => {
    console.log(`${data}`.split("\n").length == 2 ? `${data}`.replace("\n", "") : `${data}`);
  });
}
async function getPhaseConfig() {
  const configPath = resolve(process.cwd(), "phase.config.js");
  try {
    const config = (await import(pathToFileURL(configPath).toString())).default;
    return config;
  } catch (error) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Config not found
`,
      `${chalk.redBright(chalk.bold("\u21B3"))} `,
      "Could not find a 'phase.config.js' file in the current working directory.\n"
    );
    console.log(
      `${chalk.magenta(chalk.bold("How to Fix:"))}
`,
      `${chalk.magenta(chalk.bold("\u21B3"))} `,
      "If no 'phase.config.js' file exists in your project, create one to use the CLI.\n",
      `${chalk.magenta(chalk.bold("\u21B3"))} `,
      "If one does exist, make sure you're running the command in the same directory as the file."
    );
    process.exit(1);
  }
}
