// next
import { NextResponse, NextRequest } from 'next/server'

// utils
import * as db from '@/utils/database'
import { API, RankUser } from '@/utils/discord'

// functions
import getBadges from '../_functions/badges'


export async function GET(request: NextRequest) {

    let searchParams = request.nextUrl.searchParams
    let userID = searchParams.get('user')
    let guildID = searchParams.get('guild')


    let discordAPI = new API()

    if(!userID || !guildID) return NextResponse.json({ message: 'Invalid Params' }, { status: 400 })

    let levelsDB = await db.levels.findOne({ guild: guildID })
    if(!levelsDB) return NextResponse.json({ message: 'Could not find Guild' }, { status: 400 })

    let userArray = levelsDB.levels.sort((a, b) => { if (a.level != b.level) return b.level - a.level; else return b.xp - a.xp })
    let userIndex = userArray.findIndex(user => user.id == userID)

    if(userIndex == -1) return NextResponse.json({ message: 'Could not find User' }, { status: 400 })

    let userData = await discordAPI.getUser(userID, 'user_id')
    let levelUser = userArray[userIndex]

    if(!userData.user) return NextResponse.json({ message: 'Could not find User' }, { status: 400 })


    let rankUser: RankUser = {
        level: levelUser.level,
        xp: levelUser.xp,
        target: levelUser.target,
        rank: userIndex+1,
        id: userData.user.id,
        global_name: userData.user.global_name || userData.user.username,
        username: userData.user.username,
        badges: getBadges(userData.user.premium_type, userData.user.public_flags),
        avatar: {
            id: userData.user.avatar || '',
            link: `https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}`,
        },
        banner: {
            id: userData.user.banner || '',
            link: `https://cdn.discordapp.com/banners/${userData.user.id}/${userData.user.banner}`,
            color: userData.user.accent_color ? '#' + userData.user.accent_color.toString(16) : null
        }
    }

    return NextResponse.json(rankUser)

}