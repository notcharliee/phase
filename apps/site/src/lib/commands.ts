export default [
  {
      "name": "afk",
      "description": "Set your AFK status.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "reason",
              "description": "Give a reason for going AFK."
          }
      ],
      "nsfw": false
  },
  {
      "name": "announce",
      "description": "Sends an announcement-style message as Phase.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "message",
              "description": "The announcement message.",
              "required": true,
              "max_length": 4000
          },
          {
              "type": 8,
              "name": "mention",
              "description": "What role to ping."
          }
      ],
      "nsfw": false
  },
  {
      "name": "avatar",
      "description": "Displays a member's avatar.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 6,
              "name": "member",
              "description": "The member you want to select.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "cat",
      "description": "Finds a random picture of a cat.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "catfact",
      "description": "Finds an interesting fact about cats.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "coffee",
      "description": "Buy me a coffee!",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "coinflip",
      "description": "Flips a coin.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "compliment",
      "description": "Generates a personal compliment for you!",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "dadjoke",
      "description": "Finds a \"funny\" dad joke.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "dog",
      "description": "Finds a random picture of a dog.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "duck",
      "description": "Finds a random picture of a duck.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "echo",
      "description": "Echoes the text you give it.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "text",
              "description": "The text to echo.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "embed",
      "description": "Opens the Phase Embed Builder.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "github",
      "description": "Fetches info about a GitHub repository.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "user",
              "description": "The repository owner.",
              "required": true
          },
          {
              "type": 3,
              "name": "repo",
              "description": "The repository name.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "giveaway create",
      "description": "Creates a new giveaway.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "prize",
              "description": "What the winner will get.",
              "required": true,
              "max_length": 200
          },
          {
              "type": 4,
              "name": "winners",
              "description": "How many members will win.",
              "required": true,
              "max_value": 15
          },
          {
              "type": 3,
              "name": "duration",
              "description": "How long the giveaway will last.",
              "required": true,
              "choices": [
                  {
                      "name": "1m",
                      "value": "60000"
                  },
                  {
                      "name": "15m",
                      "value": "900000"
                  },
                  {
                      "name": "30m",
                      "value": "1800000"
                  },
                  {
                      "name": "1h",
                      "value": "3600000"
                  },
                  {
                      "name": "6h",
                      "value": "21600000"
                  },
                  {
                      "name": "12h",
                      "value": "43200000"
                  },
                  {
                      "name": "1d",
                      "value": "86400000"
                  },
                  {
                      "name": "7d",
                      "value": "604800000"
                  }
              ]
          }
      ],
      "nsfw": false
  },
  {
      "name": "giveaway delete",
      "description": "Deletes a giveaway.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "id",
              "description": "The ID of the giveaway.",
              "required": true,
              "max_length": 200
          }
      ],
      "nsfw": false
  },
  {
      "name": "giveaway reroll",
      "description": "Randomly rerolls a giveaway.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "id",
              "description": "The ID of the giveaway.",
              "required": true
          },
          {
              "type": 4,
              "name": "amount",
              "description": "How many winners you want to reroll."
          }
      ],
      "nsfw": false
  },
  {
      "name": "help",
      "description": "Having trouble? We can help.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "level leaderboard",
      "description": "Generates the server level leaderboard.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 4,
              "name": "rank-start",
              "description": "What rank to start from.",
              "required": true,
              "min_value": 1
          },
          {
              "type": 4,
              "name": "rank-count",
              "description": "How many ranks to include (maximum of 15 at a time).",
              "required": true,
              "min_value": 1,
              "max_value": 15
          }
      ],
      "nsfw": false
  },
  {
      "name": "level rank",
      "description": "Generates your server rank card.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 6,
              "name": "user",
              "description": "Specify a user."
          }
      ],
      "nsfw": false
  },
  {
      "name": "level set",
      "description": "Sets a users rank data.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 6,
              "name": "user",
              "description": "Specify a user.",
              "required": true
          },
          {
              "type": 4,
              "name": "level",
              "description": "Set a new level rank for the user.",
              "required": true
          },
          {
              "type": 4,
              "name": "xp",
              "description": "Set a new xp rank for the user.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "lock",
      "description": "Locks and unlocks a channel.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 5,
              "name": "state",
              "description": "The state of the channel lock.",
              "required": true
          },
          {
              "type": 8,
              "name": "role",
              "description": "Specify a role to lock access for (defaults to @everyone)."
          }
      ],
      "nsfw": false
  },
  {
      "name": "membercount",
      "description": "Displays the server member count.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "nuke",
      "description": "Deletes the current channel and creates an exact copy with no messages.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "partner add",
      "description": "Adds new partners via partner invite code.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "code",
              "description": "Enter a valid partner invite code.",
              "required": true,
              "min_length": 8,
              "max_length": 8
          }
      ],
      "nsfw": false
  },
  {
      "name": "partner advert",
      "description": "Opens a modal for setting the server advert.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "partner channel",
      "description": "Sets the partnership channel.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "partner invite",
      "description": "Generates a unique one-time partner invite code.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "partner list",
      "description": "Lists current partners by server name and ID.",
      "default_member_permissions": null,
      "dm_permission": false,
      "nsfw": false
  },
  {
      "name": "partner remove",
      "description": "Removes existing partners via server IDs.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 3,
              "name": "server",
              "description": "Enter a valid partner server ID.",
              "required": true,
              "min_length": 8
          }
      ],
      "nsfw": false
  },
  {
      "name": "ping",
      "description": "Calculates the current bot latency metrics.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "poll",
      "description": "Creates a poll reaction message.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "question",
              "description": "Type your question here.",
              "required": true
          },
          {
              "type": 3,
              "name": "choice_a",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_b",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_c",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_d",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_e",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_f",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_g",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_h",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_i",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_j",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_k",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_l",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_m",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_n",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_o",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_p",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_q",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_r",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_s",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          },
          {
              "type": 3,
              "name": "choice_t",
              "description": "Add a choice to the poll (start with an emoji to edit the reaction).",
              "max_length": 150
          }
      ],
      "nsfw": false
  },
  {
      "name": "purge",
      "description": "Purges up to 100 messages from the channel at a time.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 4,
              "name": "amount",
              "description": "The number of messages to purge.",
              "required": true,
              "min_value": 1,
              "max_value": 100
          },
          {
              "type": 6,
              "name": "author",
              "description": "The author of the messages."
          }
      ],
      "nsfw": false
  },
  {
      "name": "rps",
      "description": "Play a game of rock-paper-scissors.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "choice",
              "description": "Your move.",
              "required": true,
              "choices": [
                  {
                      "name": "Rock",
                      "value": "rock"
                  },
                  {
                      "name": "Paper",
                      "value": "paper"
                  },
                  {
                      "name": "Scissors",
                      "value": "scissors"
                  }
              ]
          }
      ],
      "nsfw": false
  },
  {
      "name": "tag add",
      "description": "Adds a tag.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "name",
              "description": "The name of the tag.",
              "required": true
          },
          {
              "type": 3,
              "name": "value",
              "description": "The value of the tag.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "tag edit",
      "description": "Edits an existing tag.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "name",
              "description": "The name of the tag.",
              "required": true
          },
          {
              "type": 3,
              "name": "value",
              "description": "The new value of the tag.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "tag get",
      "description": "Gets a tag by name.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "name",
              "description": "The name of the tag.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "tag list",
      "description": "Lists all the tags in the server.",
      "default_member_permissions": null,
      "dm_permission": true,
      "nsfw": false
  },
  {
      "name": "tag remove",
      "description": "Removes a tag.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "name",
              "description": "The name of the tag.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "tictactoe",
      "description": "Play tic-tac-toe against another user.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 6,
              "name": "member",
              "description": "The member you want to select.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "whois",
      "description": "Displays member data in an embed.",
      "default_member_permissions": null,
      "dm_permission": false,
      "options": [
          {
              "type": 6,
              "name": "member",
              "description": "The member you want to select.",
              "required": true
          }
      ],
      "nsfw": false
  },
  {
      "name": "youtube",
      "description": "Fetches info about a YouTube video.",
      "default_member_permissions": null,
      "dm_permission": true,
      "options": [
          {
              "type": 3,
              "name": "video",
              "description": "The video URL.",
              "required": true
          }
      ],
      "nsfw": false
  }
]