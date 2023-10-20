// next
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// utils
import { API, ChannelType } from '@/utils/discord'
import * as db from '@/utils/database'
import isAuthorised from '@/utils/authorised'

// components
import { ElementList, ChannelDropdown, RoleDropdown } from '@/utils/components'
import NumberInput from './_components/NumberInput'
import UpdateModuleData from '../_components/UpdateModuleData'

// packages
import { Routes, RESTGetAPIGuildRolesResult, RESTGetAPIGuildMemberResult, APIGuildChannelResolvable } from 'discord-api-types/rest/v10'


export const metadata = { title: 'Levels' }
export const dynamic = 'force-dynamic'

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    // check if user is authorised
    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    if(!authorised) return redirect(process.env.BASE_URL + '/redirect/login')

    // initialise the api
    let discordApi = new API()

    // fetch and filter channels
    let channels = await discordApi.fetch<APIGuildChannelResolvable[]>(Routes.guildChannels(searchParams.guild))
    let filteredChannels = channels.filter((channel) => { return channel.type == ChannelType.GuildText }).sort((a: APIGuildChannelResolvable, b: APIGuildChannelResolvable) => { return a.position - b.position })

    // fetch and filter roles
    let roles = await discordApi.fetch<RESTGetAPIGuildRolesResult>(Routes.guildRoles(searchParams.guild))

    let botMember = await discordApi.fetch<RESTGetAPIGuildMemberResult>(Routes.guildMember(searchParams.guild, process.env.DISCORD_ID))
    let botRoles = roles.filter(role => botMember.roles.includes(role.id)).sort((a, b) => { return b.position - a.position })

    let filteredRoles = roles.filter((role) => { return role.name != '@everyone' && !role.managed && botRoles[0].position > role.position }).sort((a, b) => { return b.position - a.position })


    // action forms

    async function saveData(formData: FormData) {
        'use server'

        let message = formData.get('message') as string | null
        let channel = formData.get('channel') as string | null
        let roleLevels = formData.getAll('roleLevel') as string[]
        let roleIds = formData.getAll('roleId') as string[]

        let setChannel = 'false'
        let msgChannel = false
        let dmsChannel = false

        if(channel == 'msgChannel') msgChannel = true
        else if(channel == 'dmsChannel') dmsChannel = true
        else if(channel) setChannel = channel.toString()

        let roles = roleIds.map((role, index) => { return { role, level: Number(roleLevels[index]) } })

        let levelsDB = await db.levels.findOne({ guild: searchParams.guild })

        if(levelsDB) {
            levelsDB.message = message?.toString() || '{member} you levelled up to level **{member.level}**! 🎉\nYour new XP target is **{member.target}** XP.'
            levelsDB.setChannel = setChannel?.toString() || 'false'
            levelsDB.msgChannel = msgChannel || false
            levelsDB.dmsChannel = dmsChannel || false
            levelsDB.roles = roles

            levelsDB.save()
        } else {
            new db.levels({
                guild: searchParams.guild,
                message: message?.toString() || '{member} you levelled up to level **{member.level}**! 🎉\nYour new XP target is **{member.target}** XP.',
                setChannel: setChannel?.toString() || 'false',
                msgChannel: msgChannel || false,
                dmsChannel: dmsChannel || false,
                roles: roles,
            }).save()
        }
    }

    async function deleteData(formData: FormData) {
        'use server'

        let levelsDB = await db.levels.findOne({ guild: searchParams.guild })
        if(levelsDB) levelsDB.deleteOne().then(() => {
            redirect(`/modules/levels?guild=${searchParams.guild}&refresh=true`)
        })
    }


    let levelsDB = await db.levels.findOne({ guild: searchParams.guild })

    return (
        <form className='flex flex-col gap-8 items-start justify-start self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full' action={saveData}>
            <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>
                Modules/<span className='gradient-text'>{metadata.title}</span>
            </h2>
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Level-Up Custom Message</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set a custom level-up message - Max 2000 Characters.</p>
                <div className='font-semibold text-sm text-[0.75rem] text-neutral-400 flex flex-col'>
                    <span className='text-white font-bold'>Available Variables:</span>
                    <span><span className='font-bold'>{'{member}'}</span> - Member Ping</span>
                    <span><span className='font-bold'>{'{member.name}'}</span> - Member Username</span>
                    <span><span className='font-bold'>{'{member.server}'}</span> - Server Name</span>
                    <span><span className='font-bold'>{'{member.level}'}</span> - New Level</span>
                    <span><span className='font-bold'>{'{member.target}'}</span> - New XP Target</span>
                </div>
                <textarea className='min-h-[4rem] bg-neutral-800 p-2 rounded-md font-medium text-white outline-none placeholder-neutral-400' defaultValue={levelsDB?.message} placeholder={`{member} you levelled up to level **{member.level}**! 🎉\nYour new XP target is **{member.target}** XP.`} name='message' maxLength={2000}></textarea>
            </div>
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Level-Up Message Channel</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Where to send the level up message.</p>
                <ChannelDropdown //@ts-ignore
                    channels={[ { id: 'msgChannel', name: 'Channel Reply' }, { id: 'dmsChannel', name: 'User DMs' }, ...filteredChannels ]}
                    name='channel'
                    required={false}
                    channelName={levelsDB?.msgChannel ? 'Channel Reply' : levelsDB?.dmsChannel ? 'User DMs' : levelsDB?.setChannel != 'false' ? channels.find((c) => c.id == levelsDB?.setChannel)?.name : undefined}
                    channelId={levelsDB?.msgChannel ? 'msgChannel' : levelsDB?.dmsChannel ? 'dmsChannel' : levelsDB?.setChannel != 'false' ? levelsDB?.setChannel : undefined}
                ></ChannelDropdown>
            </div>
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Level-Up Rewards</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Where to send the level up message.</p>
                <ElementList
                    element={
                        <div className='w-full flex gap-2'>
                            <NumberInput></NumberInput>
                            <RoleDropdown roles={filteredRoles} name='roleId' required={false}></RoleDropdown>
                        </div>
                    }
                    defaultValues={
                        levelsDB?.roles.map(roleData => { return (
                            <div className='w-full flex gap-2'>
                                <NumberInput defaultValue={roleData.level}></NumberInput>
                                <RoleDropdown roles={filteredRoles} name='roleId' required={false} roleId={roleData.role} roleName={roles.find(role => role.id == roleData.role)?.name}></RoleDropdown>
                            </div>
                        ) })
                    }
                    name='Role'
                    maxCount={15}
                ></ElementList>
            </div>
            <UpdateModuleData deleteData={deleteData}></UpdateModuleData>
        </form>
    )
}
