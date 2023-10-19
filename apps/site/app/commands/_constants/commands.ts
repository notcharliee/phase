type command = {
    name: string,
    description: string,
    type: 'Fun' | 'Games' | 'Info' | 'Moderation' | 'Module' | 'Misc',
    permission?: 'Low' | 'Medium' | 'High' | 'Owner',
    options?: string[]
}

const commandsArray: command[] = [
    {
        name: 'cat',
        description: 'Finds a random picture of a cat from the Phase API.',
        type: 'Fun'
    },
    {
        name: 'catfact',
        description: 'Finds an interesting fact about cats from the Phase API.',
        type: 'Fun'
    },
    {
        name: 'compliment',
        description: 'Generates a personal compliment for you!',
        type: 'Fun'
    },
    {
        name: 'dadjoke',
        description: 'Finds a "funny" dad joke from the Phase API.',
        type: 'Fun'
    },
    {
        name: 'dog',
        description: 'Finds a random picture of a dog from the Phase API.',
        type: 'Fun'
    },
    {
        name: 'duck',
        description: 'Finds a random picture of a duck from the Phase API.',
        type: 'Fun'
    },
    {
        name: 'earth',
        description: 'Finds a picture of earth from the NASA API.',
        type: 'Fun',
        options: ['Year', 'Month', 'Day']
    },
    {
        name: 'flip',
        description: 'Flips a coin',
        type: 'Fun'
    },
    {
        name: 'connect4',
        description: 'Play a game of connect-4 against another user.',
        type: 'Games',
        options: ['Opponent']
    },
    {
        name: 'rps',
        description: 'Play a game of rock-paper-scissors against the bot.',
        type: 'Games',
        options: ['Choice']
    },
    {
        name: 'tictactoe',
        description: 'Play a game of TicTacToe against another user.',
        type: 'Games',
        options: ['Opponent']
    },
    {
        name: 'trivia',
        description: 'Play a game of trivia.',
        type: 'Games',
        options: ['Answers']
    },
    {
        name: 'github',
        description: 'Finds information about a github repository.',
        type: 'Info',
        options: ['Repository']
    },
    {
        name: 'help',
        description: 'Lists all the bot commands and modules.',
        type: 'Info'
    },
    {
        name: 'membercount',
        description: 'Fetches the server member count.',
        type: 'Info'
    },
    {
        name: 'ping',
        description: 'Calculates the current bot latency metrics.',
        type: 'Info'
    },
    {
        name: 'youtube',
        description: 'Lists information about a YouTube video.',
        type: 'Info'
    },
    {
        name: 'announce',
        description: 'Sends an announcement using the bot.',
        type: 'Moderation',
        options: ['Channel', 'Message', 'Mention'],
        permission: 'High'
    },
    {
        name: 'giveaway create',
        description: 'Creates a new giveaway.',
        type: 'Moderation',
        options: ['Wins', 'Prize', 'Duration'],
        permission: 'Medium'
    },
    {
        name: 'giveaway delete',
        description: 'Deletes an existing giveaway.',
        type: 'Moderation',
        options: ['Giveaway'],
        permission: 'Medium'
    },
    {
        name: 'lockdown',
        description: 'Lockdowns a channel so members cannot send messages.',
        type: 'Moderation',
        options: ['Lock'],
        permission: 'Medium'
    },
    {
        name: 'nick',
        description: 'Changes the bot nickname for the server.',
        type: 'Moderation',
        options: ['Nickname'],
        permission: 'Low'
    },
    {
        name: 'leaderboard',
        description: 'Generates the server level leaderboard.',
        type: 'Module'
    },
    {
        name: 'rank',
        description: 'Generates your server rank card.',
        type: 'Module'
    },
    {
        name: 'afk',
        description: 'Sets your AFK status in a server.',
        type: 'Misc',
        options: ['Message']
    },
    {
        name: 'avatar',
        description: 'Fetches a yours or another members user avatar.',
        type: 'Misc',
        options: ['Member']
    },
    {
        name: 'colour',
        description: 'Displays a hexcode in an image.',
        type: 'Misc',
        options: ['Hex']
    },
    {
        name: 'emojis',
        description: 'Lists all the server custom emojis.',
        type: 'Misc'
    },
    {
        name: 'poll',
        description: 'Creates a poll reaction message.',
        type: 'Misc',
        options: ['Name', '+9 Options']
    }
]

export default commandsArray