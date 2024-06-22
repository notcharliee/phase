# Phasebot

[![npm](https://img.shields.io/npm/v/phasebot?color=blue&label=phasebot)](https://www.npmjs.com/package/phasebot)

Phasebot provides an array of utilities for building and running bots with [discord.js](https://discord.js.org/).

It handles the boilerplate code for you, and provides a useful CLI tool for speedily running and compiling your code using the full power of the [bun](https://bun.sh/) runtime and bundler.

> Note: Since the CLI heavily relies on bun to work, only the bun runtime is supported at the moment. I plan to add support for other runtimes like [Node.js](https://nodejs.org/) and [Deno](https://deno.land/) in the future.

## Getting Started

First, install both the `phasebot` and `discord.js` packages:

```bash
bun install phasebot discord.js
```

Then create a `phase.config.{ts,js,cjs,mjs}` file in your project root, and copy in the following code:

```ts
import { ActivityType, Partials } from "discord.js"
import { setConfig } from "phasebot"

import type { Config } from "phasebot"

const config: Config = {
  intents: [
    // Add your intents here ...
  ],
  partials: [
    // Add your partials here ...
  ],
  presence: {
    activities: [
      {
        name: "🟢 I'm online!",
        type: ActivityType.Custom,
      },
    ],
    status: "online",
  },
}
```

After that, make a `.env` file in your project root, and add the following:

```bash
DISCORD_TOKEN="your-bot-token"
```

Then finally, start the bot in your terminal with the following command:

```bash
bun run phase dev
```

And that's it! Your bot is now running and ready to go.

> More documentation coming soon!
