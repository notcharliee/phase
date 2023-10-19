export type module = { 
    name: string,
    id: string,
    description: string,
    type: 'Fun' | 'Info' | 'Moderation' | 'Utility' | 'Misc'
    complexity: 'Low' | 'Medium' | 'High',
    guild?: string,
}

const modulesArray: module[] = [
    {
        name: 'Action Logs',
        id: 'actionlogs',
        description: 'Provides a detailed record of all server activities and events.',
        type: 'Info',
        complexity: 'Low',
    },
    {
        name: 'Auto Roles',
        id: 'autoroles',
        description: 'Automatically assigns predefined roles to new users upon joining.',
        type: 'Utility',
        complexity: 'Low',
    },
    {
        name: 'Join to Create',
        id: 'jointocreate',
        description: 'Allows users to dynamically create temporary voice channels upon joining a designated voice channel.',
        type: 'Utility',
        complexity: 'Low',
    },
    {
        name: 'Levels & XP',
        id: 'levels',
        description: 'Rewards activity with XP and level ups as users reach milestones.',
        type: 'Utility',
        complexity: 'Medium',
    },
    {
        name: 'Reaction Roles',
        id: 'reactionroles',
        description: 'Enables users to self-assign roles by reacting to a specific message.',
        type: 'Utility',
        complexity: 'Medium',
    },
    {
        name: 'Tickets',
        id: 'tickets',
        description: 'Simplifies user support by allowing them to create individualised assistance channels.',
        type: 'Utility',
        complexity: 'Medium',
    },
]

export { modulesArray }