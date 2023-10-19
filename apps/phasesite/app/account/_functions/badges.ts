let badgeFlags: { [key: string]: string } = {
    '1': 'discordstaff',
    '2': 'discordpartner',
    '4': 'hypesquadevents',
    '8': 'discordbughunter1',
    '64': 'hypesquadbravery',
    '128': 'hypesquadbrilliance',
    '256': 'hypesquadbalance',
    '512': 'discordearlysupporter',
    '16384': 'discordbughunter2',
    '131072': 'discordbotdev',
    '262144': 'discordmod',
    '4194304': 'activedeveloper'
}

let badgeNames: { [key: string]: number } = {
    DISCORD_EMPLOYEE: 1 << 0,
    PARTNERED_SERVER_OWNER: 1 << 1,
    HYPESQUAD_EVENTS: 1 << 2,
    BUG_HUNTER_LEVEL_1: 1 << 3,
    HOUSE_BRAVERY: 1 << 6,
    HOUSE_BRILLIANCE: 1 << 7,
    HOUSE_BALANCE: 1 << 8,
    EARLY_SUPPORTER: 1 << 9,
    TEAM_USER: 1 << 10,
    SYSTEM: 1 << 12,
    BUG_HUNTER_LEVEL_2: 1 << 14,
    VERIFIED_BOT: 1 << 16,
    EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
    CERTIFIED_MODERATOR: 1 << 18,
    BOT_HTTP_INTERACTIONS: 1 << 19,
    ACTIVE_DEVELOPER: 1 << 22
}


export default function getBadges(premiumType?: number, publicFlags?: number) {

    let badges: string[] = []
    
    for (let badge in badgeNames) {
        let badgeFlag = badgeNames[badge].toString()

   
        if(publicFlags! & badgeNames[badge]) badges.push(badgeURL(badgeFlags[badgeFlag]))
    }

    if(premiumType && premiumType == 1 || 2 || 3) badges.push(badgeURL('discordnitro'))

    return badges

}

function badgeURL(badge: string) {
    return `https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/${badge}.svg`
}