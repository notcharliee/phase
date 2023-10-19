import * as db from '@/utils/database'
import { PermissionsBitField } from '@/utils/discord/classes/PermissionsBitField'

import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/rest/v10'


export default async function isAuthorised(session_id: string | undefined, guild?: string) {

    if(!session_id) return
    
    let schema = await db.logins.findOne({ session_id })
    if(!schema) return 

    let { user, guilds } = schema


    let authorisedGuilds: RESTAPIPartialCurrentUserGuild[] = []

    for (let guild of guilds) {
        let bitPermissions = new PermissionsBitField(BigInt(guild.permissions))

        if(!guild.owner) continue
        else if(!bitPermissions.has(PermissionsBitField.Flags.ManageGuild)) continue

        authorisedGuilds.push(guild)
    }


    if(guild && authorisedGuilds.some((authorisedGuild) => guild == authorisedGuild.id)) return { user, guilds, authorisedGuilds }
    if(guild && !authorisedGuilds.some((authorisedGuild) => guild == authorisedGuild.id)) return

    return { user, guilds, authorisedGuilds }

}