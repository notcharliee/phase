interface CommandsConfig {
  name: string
  description: string
  path: string
}

export const commandsConfig = [
  {
    name: "cat",
    description: "Finds a random picture of a cat.",
    path: "/cat",
  },
  {
    name: "catfact",
    description: "Gives you an interesting fact about cats.",
    path: "/catfact",
  },
  { name: "coinflip", description: "Flip a coin.", path: "/coinflip" },
  {
    name: "compliment",
    description: "Gives you a compliment.",
    path: "/compliment",
  },
  {
    name: "dog",
    description: "Finds a random picture of a dog.",
    path: "/dog",
  },
  {
    name: "duck",
    description: "Finds a random picture of a duck.",
    path: "/duck",
  },
  {
    name: "rps",
    description: "Play a game of rock-paper-scissors.",
    path: "/rps",
  },
  {
    name: "tictactoe",
    description: "Play tic-tac-toe against another user.",
    path: "/tictactoe",
  },
  { name: "help", description: "Having trouble? We can help!", path: "/help" },
  {
    name: "membercount",
    description: "Get the server membercount.",
    path: "/membercount",
  },
  {
    name: "ping",
    description: "Calculates the current bot ping.",
    path: "/ping",
  },
  { name: "echo", description: "Echoes the text you give it.", path: "/echo" },
  {
    name: "embed",
    description: "Opens the Phase Embed Builder.",
    path: "/embed",
  },
  { name: "afk", description: "Set your AFK status.", path: "/afk" },
  {
    name: "level rank",
    description: "Generates your server rank card.",
    path: "/level-rank",
  },
  {
    name: "level leaderboard",
    description: "Generates the server level leaderboard.",
    path: "/level-leaderboard",
  },
  {
    name: "level set",
    description: "Sets a users rank data.",
    path: "/level-set",
  },
  { name: "tag add", description: "Adds a tag.", path: "/tag-add" },
  {
    name: "tag edit",
    description: "Edits an existing tag.",
    path: "/tag-edit",
  },
  { name: "tag get", description: "Gets a tag by name.", path: "/tag-get" },
  {
    name: "tag list",
    description: "Lists all the tags in the server.",
    path: "/tag-list",
  },
  { name: "tag remove", description: "Removes a tag.", path: "/tag-remove" },
  {
    name: "poll",
    description: "Creates a poll reaction message.",
    path: "/poll",
  },
  {
    name: "github user",
    description: "Get info about a GitHub user.",
    path: "/github-user",
  },
  {
    name: "github repo",
    description: "Get info about a GitHub repository.",
    path: "/github-repo",
  },
  { name: "avatar", description: "Get a member's avatar.", path: "/avatar" },
  {
    name: "youtube",
    description: "Get info about a YouTube video.",
    path: "/youtube",
  },
  {
    name: "purge",
    description: "Purges up to 100 messages from the channel at a time.",
    path: "/purge",
  },
  {
    name: "whois",
    description: "Displays member data in an embed.",
    path: "/whois",
  },
  {
    name: "announce",
    description: "Sends an announcement-style message as Phase.",
    path: "/announce",
  },
  { name: "lock", description: "Locks and unlocks a channel.", path: "/lock" },
  {
    name: "nuke",
    description:
      "Deletes the current channel and creates an exact copy with no messages.",
    path: "/nuke",
  },
  {
    name: "giveaway create",
    description: "Creates a new giveaway.",
    path: "/giveaway-create",
  },
  {
    name: "giveaway delete",
    description: "Deletes a giveaway.",
    path: "/giveaway-delete",
  },
  {
    name: "giveaway reroll",
    description: "Randomly rerolls a giveaway.",
    path: "/giveaway-reroll",
  },
  { name: "warn add", description: "Add a warning.", path: "/warn-add" },
  {
    name: "warn remove",
    description: "Remove a warning.",
    path: "/warn-remove",
  },
  {
    name: "ticket lock",
    description: "Lock the ticket.",
    path: "/ticket-lock",
  },
  {
    name: "ticket unlock",
    description: "Unlock the ticket.",
    path: "/ticket-unlock",
  },
  {
    name: "ticket delete",
    description: "Delete the ticket.",
    path: "/ticket-delete",
  },
] as const satisfies CommandsConfig[]
