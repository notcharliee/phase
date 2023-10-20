// next
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// utils
import { API } from '@/utils/discord'
import * as db from '@/utils/database'
import isAuthorised from '@/utils/authorised'

// components
import { ElementList, RoleDropdown } from '@/utils/components'
import MessageInput from './_components/MessageInput'
import UpdateModuleData from '../_components/UpdateModuleData'

// packages
import { Routes, RESTGetAPIGuildRolesResult, RESTGetAPIGuildMemberResult, APIGuildChannelResolvable, RESTPutAPIChannelMessageReactionResult } from 'discord-api-types/rest/v10'


export const metadata = { title: 'Reaction Roles' }
export const dynamic = 'force-dynamic'

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    // check if user is authorised
    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    if(!authorised) return redirect(process.env.BASE_URL + '/redirect/login')

    // initialise the api
    let discordApi = new API()

    // fetch and filter channels
    let channels = await discordApi.fetch<APIGuildChannelResolvable[]>(Routes.guildChannels(searchParams.guild))

    // fetch and filter roles
    let roles = await discordApi.fetch<RESTGetAPIGuildRolesResult>(Routes.guildRoles(searchParams.guild))

    let botMember = await discordApi.fetch<RESTGetAPIGuildMemberResult>(Routes.guildMember(searchParams.guild, process.env.DISCORD_ID))
    let botRoles = roles.filter(role => botMember.roles.includes(role.id)).sort((a, b) => { return b.position - a.position })

    let filteredRoles = roles.filter((role) => { return role.name != '@everyone' && !role.managed && botRoles[0].position > role.position }).sort((a, b) => { return b.position - a.position })


    // action forms

    async function saveData(formData: FormData) {
        'use server'

        let message = formData.get('message') as string | null
        let roleEmojis = formData.getAll('roleEmoji') as string[]
        let roleIds = formData.getAll('roleId') as string[]

        let channelId = message?.split(`https://discord.com/channels/${searchParams.guild}/`)[1].split('/')[0]
        let messageId = message?.split(`https://discord.com/channels/${searchParams.guild}/${channelId}/`)[1]
        let reactions = roleIds.map((role, index) => { return { role, emoji: roleEmojis[index] } })

        let reactionRolesDB = await db.reactionroles.findOne({ guild: searchParams.guild })

        if(reactionRolesDB) {
            reactionRolesDB.channel = channelId?.toString() || ''
            reactionRolesDB.message = messageId?.toString() || ''
            reactionRolesDB.reactions = reactions

            reactionRolesDB.save()
        } else {
            new db.reactionroles({
                guild: searchParams.guild,
                channel: channelId?.toString() || '',
                message: messageId?.toString() || '',
                reactions: reactions,
            }).save()
        }

        addReactions(reactions, channelId!, messageId!)

        async function addReactions(reactions: { role: string, emoji: string }[], channelId: string, messageId: string) {
            for (let reaction of reactions) {
                let discordApi = new API()
                let emoji = encodeURIComponent(reaction.emoji)
                
                try {
                    await discordApi.fetch<RESTPutAPIChannelMessageReactionResult>(Routes.channelMessageOwnReaction(channelId!, messageId!, emoji), { method: 'PUT' })
                } catch {
                    continue
                }
            }
        }
    }

    async function deleteData(formData: FormData) {
        'use server'

        let reactionRolesDB = await db.reactionroles.findOne({ guild: searchParams.guild })
        if(reactionRolesDB) reactionRolesDB.deleteOne().then(() => {
            redirect(`/modules/reactionroles?guild=${searchParams.guild}&refresh=true`)
        })
    }


    let reactionRolesDB = await db.reactionroles.findOne({ guild: searchParams.guild })

    return (
        <form className='flex flex-col gap-8 items-start justify-start self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full' action={saveData}>
            <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>
                Modules/<span className='gradient-text'>{metadata.title}</span>
            </h2>
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Message Location</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>The link to the reaction role message. For example:</p>
                <p className='font-bold text-sm text-[0.75rem] text-neutral-300 break-words'>https://discord.com/channels/{searchParams.guild}/{'{channel}'}/{'{message}'}</p>
                <MessageInput
                    defaultValue={reactionRolesDB?.channel && reactionRolesDB?.message ? `https://discord.com/channels/${searchParams.guild}/${reactionRolesDB.channel}/${reactionRolesDB.message}` : undefined}
                    guild={searchParams.guild}
                    channels={channels.map(channel => { return channel.id })}
                ></MessageInput>
            </div>
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Reaction Roles</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Define what reactions will give what roles when selected.</p>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Upon saving, Phase will automatically add the necessary reactions for you.</p>
                <ElementList
                    element={
                        <div className='w-full flex gap-2'>
                            <input
                                placeholder='# Emoji'
                                name='roleEmoji'
                                className='w-24 bg-neutral-800 p-2 rounded-md outline-none font-semibold text-white placeholder-neutral-400'
                                maxLength={2}
                                type='text'
                            ></input>
                            <RoleDropdown roles={filteredRoles} name='roleId' required={false}></RoleDropdown>
                        </div>
                    }
                    defaultValues={
                        reactionRolesDB?.reactions.map(reaction => { return (
                            <div className='w-full flex gap-2'>
                                <input
                                    placeholder='# Emoji'
                                    defaultValue={reaction.emoji}
                                    name='roleEmoji'
                                    className='w-24 bg-neutral-800 p-2 rounded-md outline-none font-semibold text-white placeholder-neutral-400'
                                    maxLength={2}
                                    type='text'
                                ></input>
                                <RoleDropdown roles={filteredRoles} name='roleId' required={false} roleId={reaction.role} roleName={roles.find(role => role.id == reaction.role)?.name}></RoleDropdown>
                            </div>
                        ) })
                    }
                    name='Role'
                    maxCount={20}
                ></ElementList>
            </div>
            <UpdateModuleData deleteData={deleteData}></UpdateModuleData>
        </form>
    )
}
