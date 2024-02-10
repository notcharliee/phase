interface CommandsConfig {
  name: string,
  description: string,
  label?: string,
  path?: string,
  disabled?: boolean,
}


export const commandsConfig: CommandsConfig[] = [
  {
    name: "/afk",
    description: "Set your AFK status.",
    path: "/afk"
  },
  {
    name: "/announce",
    description: "Sends an announcement-style message as Phase.",
    path: "/announce"
  },
  {
    name: "/avatar",
    description: "Displays a member's avatar.",
    path: "/avatar"
  },
  {
    name: "/cat",
    description: "Finds a random picture of a cat.",
    path: "/cat"
  },
  {
    name: "/catfact",
    description: "Finds an interesting fact about cats.",
    path: "/catfact"
  },
  {
    name: "/coinflip",
    description: "Flips a coin.",
    path: "/coinflip"
  },
  {
    name: "/compliment",
    description: "Generates a personal compliment for you!",
    path: "/compliment"
  },
  {
    name: "/dadjoke",
    description: "Finds a 'funny' dad joke.",
    path: "/dadjoke"
  },
  {
    name: "/dog",
    description: "Finds a random picture of a dog.",
    path: "/dog"
  },
  {
    name: "/duck",
    description: "Finds a random picture of a duck.",
    path: "/duck"
  },
  {
    name: "/echo",
    description: "Echoes the text you give it.",
    path: "/echo"
  },
  {
    name: "/embed",
    description: "Opens the Phase Embed Builder.",
    path: "/embed"
  },
  {
    name: "/github",
    description: "Fetches info about a GitHub repository.",
    path: "/github"
  },
  {
    name: "/giveaway create",
    description: "Creates a new giveaway.",
    path: "/giveaway-create"
  },
  {
    name: "/giveaway delete",
    description: "Deletes a giveaway.",
    path: "/giveaway-delete"
  },
  {
    name: "/giveaway reroll",
    description: "Randomly rerolls a giveaway.",
    path: "/giveaway-reroll"
  },
  {
    name: "/help",
    description: "Having trouble? We can help.",
    path: "/help"
  },
  {
    name: "/level leaderboard",
    description: "Generates the server level leaderboard.",
    path: "/level-leaderboard"
  },
  {
    name: "/level rank",
    description: "Generates your server rank card.",
    path: "/level-rank"
  },
  {
    name: "/level set",
    description: "Sets a user's rank data.",
    path: "/level-set"
  },
  {
    name: "/lock",
    description: "Locks and unlocks a channel.",
    path: "/lock"
  },
  {
    name: "/membercount",
    description: "Displays the server member count.",
    path: "/membercount"
  },
  {
    name: "/nuke",
    description: "Deletes the current channel and creates an exact copy with no messages.",
    path: "/nuke"
  },
  {
    name: "/ping",
    description: "Calculates the current bot latency metrics.",
    path: "/ping"
  },
  {
    name: "/poll",
    description: "Creates a poll reaction message.",
    path: "/poll"
  },
  {
    name: "/purge",
    description: "Purges up to 100 messages from the channel at a time.",
    path: "/purge"
  },
  {
    name: "/rps",
    description: "Play a game of rock-paper-scissors.",
    path: "/rps"
  },
  {
    name: "/tag add",
    description: "Adds a tag.",
    path: "/tag-add"
  },
  {
    name: "/tag edit",
    description: "Edits an existing tag.",
    path: "/tag-edit"
  },
  {
    name: "/tag get",
    description: "Gets a tag by name.",
    path: "/tag-get"
  },
  {
    name: "/tag list",
    description: "Lists all the tags in the server.",
    path: "/tag-list"
  },
  {
    name: "/tag remove",
    description: "Removes a tag.",
    path: "/tag-remove"
  },
  {
    name: "/tictactoe",
    description: "Play tic-tac-toe against another user.",
    path: "/tictactoe"
  },
  {
    name: "/whois",
    description: "Displays member data in an embed.",
    path: "/whois"
  },
  {
    name: "/youtube",
    description: "Fetches info about a YouTube video.",
    path: "/youtube"
  }
]
